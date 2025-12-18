// Spring Boot API - 장바구니 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { Cart } from '@/types';

// 장바구니 추가 요청
export interface AddToCartRequest {
  products_id: string;
  quantity: number;
}

// 장바구니 수량 수정 요청
export interface UpdateCartQuantityRequest {
  quantity: number;
}

// ========================================
// Cart API
// ========================================

export const cartService = {
  /**
   * 장바구니 목록 조회
   * GET /cart
   */
  async getCart(): Promise<ApiResponse<Cart[]>> {
    return apiClient.get<Cart[]>('/cart');
  },

  /**
   * 장바구니 추가
   * POST /cart
   */
  async addToCart(data: AddToCartRequest): Promise<ApiResponse<{ cart_id: string }>> {
    return apiClient.post<{ cart_id: string }>('/cart', data);
  },

  /**
   * 장바구니 수량 수정
   * PUT /cart/{id}
   */
  async updateCartQuantity(cartId: string, quantity: number): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`/cart/${cartId}`, { quantity });
  },

  /**
   * 장바구니 항목 삭제
   * DELETE /cart/{id}
   */
  async removeFromCart(cartId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/cart/${cartId}`);
  },

  /**
   * 장바구니 전체 삭제
   * DELETE /cart
   */
  async clearCart(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/cart');
  },
};
