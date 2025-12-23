import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, LoginRequest, OAuthLoginRequest } from '@/services/authService';
import { User } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  oauthLogin: (data: OAuthLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          
          if (response.success && response.data) {
            const { accessToken, refreshToken, email, name, userRole } = response.data;
            
            // API 클라이언트에 토큰 설정
            apiClient.setToken(accessToken);
            
            // 백엔드 응답을 User 타입으로 변환
            const user: User = {
              user_id: '', // JWT에서 추출하거나 별도 API 호출 필요
              user_email: email,
              user_name: name,
              user_phone: '',
              user_oauth_provider: undefined,
              user_oauth_id: undefined,
              user_enter_day: new Date().toISOString().split('T')[0],
              user_status: 1,
              user_exit_day: undefined,
            };
            
            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.error || '로그인에 실패했습니다.');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      oauthLogin: async (data: OAuthLoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.oauthLogin(data);
          
          if (response.success && response.data) {
            const { accessToken, refreshToken, email, name, userRole } = response.data;
            
            apiClient.setToken(accessToken);
            
            // 백엔드 응답을 User 타입으로 변환
            const user: User = {
              user_id: '',
              user_email: email,
              user_name: name,
              user_phone: '',
              user_oauth_provider: data.provider,
              user_oauth_id: data.oauth_id,
              user_enter_day: new Date().toISOString().split('T')[0],
              user_status: 1,
              user_exit_day: undefined,
            };
            
            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.error || 'OAuth 로그인에 실패했습니다.');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // 로그아웃은 항상 성공 처리 (네트워크 오류여도 클라이언트에서 로그아웃)
          apiClient.clearToken();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      checkAuth: async () => {
        const { accessToken } = get();
        
        if (!accessToken) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          // API 클라이언트에 토큰 설정 (localStorage에서 복원된 경우)
          apiClient.setToken(accessToken);
          
          // TODO: 백엔드에 사용자 정보 조회 API가 구현되면 사용
          // 현재는 토큰이 있으면 인증된 것으로 간주
          // const response = await authService.getMe();
          // if (response.success && response.data) {
          //   set({
          //     user: response.data,
          //     isAuthenticated: true,
          //     isLoading: false,
          //   });
          // } else {
          //   get().logout();
          // }
          
          // 임시: 토큰이 있으면 인증된 것으로 간주
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth check error:', error);
          get().logout();
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          return false;
        }

        try {
          const response = await authService.refreshToken(refreshToken);
          
          if (response.success && response.data) {
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            apiClient.setToken(accessToken);
            
            set({
              accessToken,
              refreshToken: newRefreshToken,
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Token refresh error:', error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage 키
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

