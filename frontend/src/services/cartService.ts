// Spring Boot API - 장바구니 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { CartItemListDTO } from '@/types';

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
  async getCart(): Promise<ApiResponse<CartItemListDTO[]>> {
    return apiClient.get<CartItemListDTO[]>('/v1/user/cart');
  },

  /**
   * 장바구니 추가
   * POST /v1/products/{productId}/cart
   */
  async addToCart(data: AddToCartRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/v1/products/${data.products_id}/cart`, { quantity: data.quantity });
  },

  /**
   * 장바구니 수량 수정
   * PUT /cart/{id}
   */
  async updateCartQuantity(cartItemId: string, quantity: number): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`/v1/user/cart/${cartItemId}`, { quantity });
  },

  /**
   * 장바구니 항목 삭제
   * DELETE /cart/{id}
   */
  async removeFromCart(cartId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/v1/user/cart/${cartId}/delete`);
  },

  /**
   * 장바구니 전체 삭제
   * DELETE /cart
   */
  async clearCart(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/cart');
  },
};
