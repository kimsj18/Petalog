// Spring Boot API - 인증 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { User } from '@/types';

// 로그인 요청 (백엔드 Spring Security formLogin 사용)
export interface LoginRequest {
  username: string; // user_email
  password: string; // user_password
}

// 로그인 응답 (백엔드가 반환하는 claims Map)
export interface LoginResponse {
  email: string;
  password: string;
  name: string;
  userRole: string;
  accessToken: string;
  refreshToken: string;
}

// 회원가입 요청
export interface RegisterRequest {
  user_email: string;
  user_name: string;
  user_phone: string;
  user_password: string;
}

// OAuth 로그인 요청
export interface OAuthLoginRequest {
  provider: 'google' | 'kakao';
  oauth_id: string;
  email: string;
  name: string;
}

// 토큰 갱신 응답
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ========================================
// Auth API
// ========================================

export const authService = {
  /**
   * 일반 로그인
   * POST /api/v1/login (Spring Security formLogin)
   * 백엔드가 claims Map을 직접 반환: { email, password, name, userRole, accessToken, refreshToken }
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Spring Security formLogin은 form data를 사용하지만, JSON도 가능하도록 시도
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    const response = await apiClient.post<LoginResponse>(
      '/v1/login',
      formData.toString(),
      true // isFormData
    );
    
    // 로그인 성공 시 토큰 저장
    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * OAuth 로그인 (Google, Kakao)
   * TODO: 백엔드에 OAuth 엔드포인트가 구현되면 수정 필요
   * POST /api/v1/oauth/login
   */
  async oauthLogin(data: OAuthLoginRequest): Promise<ApiResponse<LoginResponse>> {
    // TODO: 백엔드 OAuth API 구현 후 수정
    const response = await apiClient.post<LoginResponse>('/v1/oauth/login', data);
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * 회원가입
   * TODO: 백엔드에 회원가입 엔드포인트가 구현되면 수정 필요
   * POST /api/v1/register
   */
  async register(data: RegisterRequest): Promise<ApiResponse<{ user_id: string }>> {
    return apiClient.post<{ user_id: string }>('/v1/register', data);
  },

  /**
   * 로그아웃
   * 백엔드에 별도 로그아웃 엔드포인트가 없을 수 있음 (클라이언트에서 토큰 제거)
   */
  async logout(): Promise<ApiResponse<void>> {
    // 백엔드에 로그아웃 API가 있다면 호출
    // const response = await apiClient.post<void>('/v1/logout');
    
    // 토큰 제거
    apiClient.clearToken();
    
    return {
      success: true,
    };
  },

  /**
   * 토큰 갱신
   * POST /api/v1/refresh
   * Authorization 헤더에 Bearer 토큰 필요
   * Body: { refreshToken: string }
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiClient.post<RefreshTokenResponse>('/v1/refresh', {
      refreshToken,
    });
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * 내 정보 조회
   * TODO: 백엔드에 사용자 정보 조회 엔드포인트가 구현되면 수정 필요
   * GET /api/v1/me
   */
  async getMe(): Promise<ApiResponse<User>> {
    // JWT 토큰에서 사용자 정보를 추출하거나 별도 API 호출
    // 현재는 토큰에서 정보를 추출하는 방식이 필요할 수 있음
    return apiClient.get<User>('/v1/me');
  },

  /**
   * 비밀번호 변경
   * PUT /auth/password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/auth/password', {
      oldPassword,
      newPassword,
    });
  },

  /**
   * 회원 탈퇴
   * DELETE /auth/account
   */
  async deleteAccount(): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<void>('/auth/account');
    
    // 탈퇴 성공 시 토큰 제거
    if (response.success) {
      apiClient.clearToken();
    }
    
    return response;
  },
};
