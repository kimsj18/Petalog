// Spring Boot API 통신 유틸리티

import * as process from "process";

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080/api';

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
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

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
      localStorage.removeItem('auth-storage');
    }
  }

  // 토큰 가져오기
  getToken(): string | null {
    return this.token;
  }

  // RefreshToken 가져오기 (localStorage에서 직접 읽기)
  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.refreshToken || null;
      }
    } catch (error) {
      console.error('Failed to get refresh token:', error);
    }
    
    return null;
  }

  // RefreshToken 저장 (localStorage에 직접 저장)
  private setRefreshToken(refreshToken: string | null) {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        parsed.state = {
          ...parsed.state,
          refreshToken,
        };
        localStorage.setItem('auth-storage', JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Failed to set refresh token:', error);
    }
  }

  // 토큰 갱신
  private async refreshAccessToken(): Promise<boolean> {
    console.log("리프레시토큰 갱신 : ")
    // 이미 갱신 중이면 기존 Promise 반환
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        console.log("리프레시토큰 겟 : {}", refreshToken)
        if (!refreshToken) {
          console.warn('No refresh token available');
          return false;
        }

        // refresh 엔드포인트는 재시도하지 않도록 별도 처리
        const response = await fetch(`${this.baseURL}/v1/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token || ''}`,
          },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Token refresh failed:', errorData);
          this.clearToken();
          return false;
        }

        const data = await response.json();
        
        if (data.accessToken && data.refreshToken) {
          this.setToken(data.accessToken);
          this.setRefreshToken(data.refreshToken);
          
          // authStore도 업데이트 (동적 import로 순환 참조 방지)
          if (typeof window !== 'undefined') {
            try {
              const { useAuthStore } = await import('@/stores/authStore');
              useAuthStore.getState().setUser(useAuthStore.getState().user);
              useAuthStore.setState({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              });
            } catch (error) {
              console.warn('Failed to update authStore:', error);
            }
          }
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Token refresh error:', error);
        this.clearToken();
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // 401 에러 처리 및 재시도
  private async handle401Error<T>(
    endpoint: string,
    requestFn: () => Promise<ApiResponse<T>>,
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    // refresh 엔드포인트는 재시도하지 않음
    if (endpoint === '/v1/refresh') {
      return requestFn();
    }

    const result = await requestFn();
    
    // 401 에러 감지 (error에 '401' 또는 'HTTP 401'이 포함된 경우)
    const is401Error = !result.success && result.error && (
      result.error.includes('401') || 
      result.error.includes('HTTP 401') ||
      result.error === 'HTTP 401'
    );
    
    // 401 에러이고 아직 재시도하지 않은 경우
    if (is401Error && retryCount === 0) {
      const refreshed = await this.refreshAccessToken();
      
      if (refreshed) {
        // 토큰 갱신 성공 시 원래 요청 재시도 (재시도 카운트 증가)
        return this.handle401Error(endpoint, requestFn, retryCount + 1);
      } else {
        // 토큰 갱신 실패 시 로그아웃 처리
        if (typeof window !== 'undefined') {
          try {
            const { useAuthStore } = await import('@/stores/authStore');
            await useAuthStore.getState().logout();
          } catch (error) {
            console.warn('Failed to logout:', error);
          }
        }
        
        return {
          success: false,
          error: '인증이 만료되었습니다. 다시 로그인해주세요.',
        };
      }
    }
    
    return result;
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
    return this.handle401Error(endpoint, async () => {
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
          credentials: 'include', // CORS 쿠키 지원
        });

        // 401 에러 감지
        if (response.status === 401) {
          return {
            success: false,
            error: `HTTP ${response.status}`,
          };
        }

        // 응답이 JSON이 아닌 경우 처리
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return {
            success: true,
          } as ApiResponse<T>;
        }

        const data = await response.json();
        
        // 백엔드가 직접 JSON을 반환하는 경우 (ApiResponse 래퍼 없음)
        if (!response.ok) {
          // 에러 응답 처리
          return {
            success: false,
            error: data.error || data.message || `HTTP ${response.status}`,
          };
        }

        // 성공 응답을 ApiResponse 형식으로 래핑
        return {
          success: true,
          data: data as T,
        };
      } catch (error: any) {
        console.error(`GET ${endpoint} error:`, error);
        return {
          success: false,
          error: error.message || '네트워크 오류가 발생했습니다.',
        };
      }
    });
  }

  // POST 요청
  async post<T>(endpoint: string, body?: any, isFormData: boolean = false): Promise<ApiResponse<T>> {
    return this.handle401Error(endpoint, async () => {
      try {
        let headers: Record<string, string>;
        let requestBody: string | FormData | undefined;
        
        if (body instanceof FormData) {
          // FormData 객체인 경우
          headers = {};
          // FormData를 사용할 때는 Content-Type을 설정하지 않음 (브라우저가 자동으로 boundary 설정)
          requestBody = body;
        } else if (isFormData) {
          // URLSearchParams를 사용할 때는 Content-Type을 명시적으로 설정
          headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
          };
          requestBody = typeof body === 'string' ? body : undefined;
        } else {
          // getHeaders()는 HeadersInit을 반환하므로 Record로 변환
          const defaultHeaders = this.getHeaders();
          headers = defaultHeaders as Record<string, string>;
          requestBody = body ? JSON.stringify(body) : undefined;
        }

        // Authorization 헤더 추가 (FormData인 경우에도)
        if (this.token) {
          headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'POST',
          headers,
          body: requestBody,
          credentials: 'include', // CORS 쿠키 지원
        });

        // 401 에러 감지
        if (response.status === 401) {
          return {
            success: false,
            error: `HTTP ${response.status}`,
          };
        }

        // 응답이 JSON이 아닌 경우 처리
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return {
            success: true,
          } as ApiResponse<T>;
        }

        const data = await response.json();

        // 백엔드가 직접 JSON을 반환하는 경우 (ApiResponse 래퍼 없음)
        if (!response.ok) {
          // 에러 응답 처리
          return {
            success: false,
            error: data.error || data.message || `HTTP ${response.status}`,
          };
        }

        // 성공 응답을 ApiResponse 형식으로 래핑
        return {
          success: true,
          data: data as T,
        };
      } catch (error: any) {
        console.error(`POST ${endpoint} error:`, error);
        return {
          success: false,
          error: error.message || '네트워크 오류가 발생했습니다.',
        };
      }
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.handle401Error(endpoint, async () => {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(body),
          credentials: 'include',
        });

        // 401 에러 감지
        if (response.status === 401) {
          return {
            success: false,
            error: `HTTP ${response.status}`,
          };
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return {
            success: true,
          } as ApiResponse<T>;
        }

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || data.message || `HTTP ${response.status}`,
          };
        }

        return {
          success: true,
          data: data as T,
        };
      } catch (error: any) {
        console.error(`PUT ${endpoint} error:`, error);
        return {
          success: false,
          error: error.message || '네트워크 오류가 발생했습니다.',
        };
      }
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.handle401Error(endpoint, async () => {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
          credentials: 'include',
        });

        // 401 에러 감지
        if (response.status === 401) {
          return {
            success: false,
            error: `HTTP ${response.status}`,
          };
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return {
            success: true,
          } as ApiResponse<T>;
        }

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || data.message || `HTTP ${response.status}`,
          };
        }

        return {
          success: true,
          data: data as T,
        };
      } catch (error: any) {
        console.error(`DELETE ${endpoint} error:`, error);
        return {
          success: false,
          error: error.message || '네트워크 오류가 발생했습니다.',
        };
      }
    });
  }
}

// API 클라이언트 인스턴스 (싱글톤)
export const apiClient = new ApiClient(API_BASE_URL);
