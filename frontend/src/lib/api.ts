// Spring Boot API 통신 유틸리티

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API 클라이언트 설정
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // 클라이언트 사이드에서만 실행
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  // 토큰 설정
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  // 토큰 제거
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  // 공통 헤더
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // GET 요청
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API 요청 실패');
      }

      return data;
    } catch (error: any) {
      console.error(`GET ${endpoint} error:`, error);
      return {
        success: false,
        error: error.message || '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // POST 요청
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API 요청 실패');
      }

      return data;
    } catch (error: any) {
      console.error(`POST ${endpoint} error:`, error);
      return {
        success: false,
        error: error.message || '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // PUT 요청
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API 요청 실패');
      }

      return data;
    } catch (error: any) {
      console.error(`PUT ${endpoint} error:`, error);
      return {
        success: false,
        error: error.message || '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API 요청 실패');
      }

      return data;
    } catch (error: any) {
      console.error(`DELETE ${endpoint} error:`, error);
      return {
        success: false,
        error: error.message || '네트워크 오류가 발생했습니다.',
      };
    }
  }
}

// API 클라이언트 인스턴스 (싱글톤)
export const apiClient = new ApiClient(API_BASE_URL);
