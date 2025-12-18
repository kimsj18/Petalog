// Spring Boot API - 인증 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { User } from '@/types';

// 로그인 요청
export interface LoginRequest {
  user_email: string;
  user_password: string;
}

// 로그인 응답
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
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

// ========================================
// Auth API
// ========================================

export const authService = {
  /**
   * 일반 로그인
   * POST /auth/login
   */
  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // 로그인 성공 시 토큰 저장
    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * OAuth 로그인 (Google, Kakao)
   * POST /auth/oauth/login
   */
  async oauthLogin(data: OAuthLoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/oauth/login', data);
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * 회원가입
   * POST /auth/register
   */
  async register(data: RegisterRequest): Promise<ApiResponse<{ user_id: string }>> {
    return apiClient.post<{ user_id: string }>('/auth/register', data);
  },

  /**
   * 로그아웃
   * POST /auth/logout
   */
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');
    
    // 토큰 제거
    apiClient.clearToken();
    
    return response;
  },

  /**
   * 토큰 갱신
   * POST /auth/refresh
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    
    if (response.success && response.data) {
      apiClient.setToken(response.data.accessToken);
    }
    
    return response;
  },

  /**
   * 내 정보 조회
   * GET /auth/me
   */
  async getMe(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/me');
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
