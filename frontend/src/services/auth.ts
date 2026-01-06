import { apiClient, ApiResponse } from './api';

// ==================== 타입 정의 ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    isAdmin?: boolean;
  };
  token: string;
}

// ==================== API 함수 ====================

/**
 * 로그인
 * POST /auth/login
 */
export async function login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials );
  if (response.success && response.data) {
    apiClient.setToken(response.data.token);
  }
  return response;
}

/**
 * 회원가입
 * POST /auth/signup
 */
export async function signUp(userData: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
  if (response.success && response.data) {
    apiClient.setToken(response.data.token);
  }
  return response;
}

/**
 * 로그아웃
 * POST /auth/logout
 */
export async function logout(): Promise<ApiResponse<void>> {
  const response = await apiClient.post<void>('/auth/logout');
  apiClient.setToken(null);
  return response;
}

/**
 * 현재 사용자 정보 조회
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<ApiResponse<AuthResponse['user']>> {
  return await apiClient.get<AuthResponse['user']>('/auth/me');
}
