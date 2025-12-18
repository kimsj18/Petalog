// Spring Boot API - 사용자 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { User, UserAddress, Pet } from '@/types';

// 배송지 등록 요청
export interface CreateAddressRequest {
  recipient_name: string;
  recipient_phone: string;
  zipcode: string;
  address1: string;
  address2?: string;
  is_default: boolean;
}

// 반려동물 등록 요청
export interface CreatePetRequest {
  pets_name: string;
  pets_birth?: string; // YYYY-MM-DD
  pets_weight?: number;
  pets_snack_type?: string;
  pets_ingredients?: string; // 알러지 원재료
}

// ========================================
// User API
// ========================================

export const userService = {
  /**
   * 내 정보 조회
   * GET /users/me
   */
  async getMyProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/users/me');
  },

  /**
   * 내 정보 수정
   * PUT /users/me
   */
  async updateMyProfile(data: Partial<User>): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/users/me', data);
  },

  // ========================================
  // 배송지 관리
  // ========================================

  /**
   * 배송지 목록 조회
   * GET /users/addresses
   */
  async getAddresses(): Promise<ApiResponse<UserAddress[]>> {
    return apiClient.get<UserAddress[]>('/users/addresses');
  },

  /**
   * 배송지 등록
   * POST /users/addresses
   */
  async createAddress(data: CreateAddressRequest): Promise<ApiResponse<{ address_id: string }>> {
    return apiClient.post<{ address_id: string }>('/users/addresses', data);
  },

  /**
   * 배송지 수정
   * PUT /users/addresses/{id}
   */
  async updateAddress(addressId: string, data: Partial<CreateAddressRequest>): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`/users/addresses/${addressId}`, data);
  },

  /**
   * 배송지 삭제
   * DELETE /users/addresses/{id}
   */
  async deleteAddress(addressId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/addresses/${addressId}`);
  },

  /**
   * 기본 배송지 설정
   * PUT /users/addresses/{id}/default
   */
  async setDefaultAddress(addressId: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`/users/addresses/${addressId}/default`);
  },

  // ========================================
  // 반려동물 관리
  // ========================================

  /**
   * 반려동물 목록 조회
   * GET /users/pets
   */
  async getPets(): Promise<ApiResponse<Pet[]>> {
    return apiClient.get<Pet[]>('/users/pets');
  },

  /**
   * 반려동물 등록
   * POST /users/pets
   */
  async createPet(data: CreatePetRequest): Promise<ApiResponse<{ pets_id: string }>> {
    return apiClient.post<{ pets_id: string }>('/users/pets', data);
  },

  /**
   * 반려동물 수정
   * PUT /users/pets/{id}
   */
  async updatePet(petId: string, data: Partial<CreatePetRequest>): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`/users/pets/${petId}`, data);
  },

  /**
   * 반려동물 삭제
   * DELETE /users/pets/{id}
   */
  async deletePet(petId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/users/pets/${petId}`);
  },
};
