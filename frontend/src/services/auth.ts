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
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  // if (response.success && response.data) {
  //   apiClient.setToken(response.data.token);
  // }
  // return response;

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 500)); // 네트워크 딜레이 시뮬레이션

  // 관리자 계정 체크
  const isAdmin = credentials.email === 'admin@dogsnack.com';

  const mockResponse: AuthResponse = {
    user: {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      isAdmin,
    },
    token: 'mock_token_' + Date.now(),
  };

  apiClient.setToken(mockResponse.token);

  return {
    success: true,
    data: mockResponse,
  };
}

/**
 * 회원가입
 * POST /auth/signup
 */
export async function signUp(userData: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
  // if (response.success && response.data) {
  //   apiClient.setToken(response.data.token);
  // }
  // return response;

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockResponse: AuthResponse = {
    user: {
      id: '2',
      email: userData.email,
      name: userData.name || userData.email.split('@')[0],
      isAdmin: false,
    },
    token: 'mock_token_' + Date.now(),
  };

  apiClient.setToken(mockResponse.token);

  return {
    success: true,
    data: mockResponse,
  };
}

/**
 * 로그아웃
 * POST /auth/logout
 */
export async function logout(): Promise<ApiResponse<void>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // const response = await apiClient.post<void>('/auth/logout');
  // apiClient.setToken(null);
  // return response;

  // 현재: Mock 처리
  apiClient.setToken(null);

  return {
    success: true,
  };
}

/**
 * 현재 사용자 정보 조회
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<ApiResponse<AuthResponse['user']>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<AuthResponse['user']>('/auth/me');

  // 현재: Mock 데이터 반환
  const token = apiClient.getToken();
  
  if (!token) {
    return {
      success: false,
      error: '로그인이 필요합니다.',
    };
  }

  return {
    success: true,
    data: {
      id: '1',
      email: 'user@example.com',
      name: 'User',
      isAdmin: false,
    },
  };
}
