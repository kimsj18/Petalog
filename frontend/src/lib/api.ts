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
      // auth-storage에서 토큰 읽기
      this.token = this.getTokenFromStorage();
    }
  }

  // auth-storage에서 accessToken 가져오기
  private getTokenFromStorage(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.accessToken || null;
      }
    } catch (error) {
      console.error('Failed to get token from storage:', error);
    }
    
    // 하위 호환성을 위해 기존 방식도 확인
    return localStorage.getItem('accessToken');
  }

  // 토큰 설정
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      // auth-storage에 저장
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          parsed.state = {
            ...parsed.state,
            accessToken: token,
          };
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        } else {
          // auth-storage가 없으면 새로 생성
          localStorage.setItem('auth-storage', JSON.stringify({
            state: { accessToken: token }
          }));
        }
      } catch (error) {
        console.error('Failed to set token in auth-storage:', error);
        // 실패 시 기존 방식으로 저장 (하위 호환성)
        localStorage.setItem('accessToken', token);
      }
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
    console.log("리프레시토큰 갱신 시작");
    
    // 이미 갱신 중이면 기존 Promise 반환
    if (this.isRefreshing && this.refreshPromise) {
      console.log("이미 리프레시 토큰 갱신 중...");
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken();
        console.log("리프레시토큰 확인:", refreshToken ? "존재함" : "없음");
        
        if (!refreshToken) {
          console.warn('리프레시 토큰이 없습니다. 로그아웃 처리합니다.');
          // 리프레시 토큰이 없으면 로그아웃 처리
          if (typeof window !== 'undefined') {
            try {
              const { useAuthStore } = await import('@/stores/authStore');
              await useAuthStore.getState().logout();
            } catch (error) {
              console.warn('로그아웃 처리 실패:', error);
            }
          }
          this.clearToken();
          return false;
        }

        // refresh 엔드포인트는 재시도하지 않도록 별도 처리
        // 최신 토큰 가져오기
        const currentToken = this.getTokenFromStorage() || this.token || '';
        const response = await fetch(`${this.baseURL}/v1/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include',
        });

        console.log("리프레시 토큰 응답 상태:", response.status);

        if (!response.ok) {
          // 응답이 JSON인지 확인
          const contentType = response.headers.get('content-type');
          let errorData = {};
          
          if (contentType && contentType.includes('application/json')) {
            try {
              errorData = await response.json();
            } catch (e) {
              console.error('JSON 파싱 실패:', e);
            }
          }
          
          console.error('토큰 갱신 실패:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          
          // 401 또는 403 에러면 리프레시 토큰도 만료된 것
          if (response.status === 401 || response.status === 403) {
            console.warn('리프레시 토큰도 만료되었습니다. 로그아웃 처리합니다.');
            if (typeof window !== 'undefined') {
              try {
                const { useAuthStore } = await import('@/stores/authStore');
                await useAuthStore.getState().logout();
              } catch (error) {
                console.warn('로그아웃 처리 실패:', error);
              }
            }
          }
          
          this.clearToken();
          return false;
        }

        // 응답이 JSON인지 확인
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('리프레시 토큰 응답이 JSON이 아닙니다:', contentType);
          this.clearToken();
          return false;
        }

        const data = await response.json();
        console.log("리프레시 토큰 갱신 성공:", {
          hasAccessToken: !!data.accessToken,
          hasRefreshToken: !!data.refreshToken
        });
        
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
              console.log("authStore 업데이트 완료");
            } catch (error) {
              console.warn('authStore 업데이트 실패:', error);
            }
          }
          
          return true;
        }
        
        console.error('리프레시 토큰 응답에 accessToken 또는 refreshToken이 없습니다:', data);
        return false;
      } catch (error) {
        console.error('토큰 갱신 중 오류 발생:', error);
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
      console.log(`401 에러 감지: ${endpoint}, 리프레시 토큰으로 갱신 시도...`);
      const refreshed = await this.refreshAccessToken();
      
      if (refreshed) {
        console.log(`토큰 갱신 성공, 요청 재시도: ${endpoint}`);
        // 토큰 갱신 성공 시 원래 요청 재시도 (재시도 카운트 증가)
        return this.handle401Error(endpoint, requestFn, retryCount + 1);
      } else {
        console.error(`토큰 갱신 실패: ${endpoint}`);
        // 토큰 갱신 실패 시 로그아웃 처리
        if (typeof window !== 'undefined') {
          try {
            const { useAuthStore } = await import('@/stores/authStore');
            await useAuthStore.getState().logout();
          } catch (error) {
            console.warn('로그아웃 처리 실패:', error);
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
  // private getHeaders(): HeadersInit {
  //   const headers: HeadersInit = {
  //     'Content-Type': 'application/json',
  //   };
  //
  //   if (this.token) {
  //     headers['Authorization'] = `Bearer ${this.token}`;
  //   }
  //
  //   return headers;
  // }
  // 공통 헤더
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // 매번 auth-storage에서 최신 토큰을 가져옴
    let token = this.token;
    if (typeof window !== 'undefined') {
      const storedToken = this.getTokenFromStorage();
      if (storedToken) {
        token = storedToken;
        // 메모리와 동기화
        if (this.token !== storedToken) {
          this.token = storedToken;
        }
      }
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('[API] Authorization 헤더에 토큰이 없습니다.');
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
        // getHeaders()에서 가져온 토큰 사용
        const token = this.getTokenFromStorage();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
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
