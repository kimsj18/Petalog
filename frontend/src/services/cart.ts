import { ApiResponse, apiClient } from './api';
import { CartItem } from '../types';

// ==================== 타입 정의 ====================

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

// ==================== API 함수 ====================

/**
 * 장바구니 조회
 * GET /cart
 */
export async function getCart(): Promise<ApiResponse<CartResponse>> {
  return await apiClient.get<CartResponse>('/cart');
}

/**
 * 장바구니에 상품 추가
 * POST /cart/items
 */
export async function addToCart(item: AddToCartRequest): Promise<ApiResponse<CartResponse>> {
  return await apiClient.post<CartResponse>('/cart/items', item);
}

/**
 * 장바구니 아이템 수량 수정
 * PATCH /cart/items/:itemId
 */
export async function updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<ApiResponse<CartResponse>> {
  return await apiClient.patch<CartResponse>(`/cart/items/${itemId}`, data);
}

/**
 * 장바구니 아이템 삭제
 * DELETE /cart/items/:itemId
 */
export async function removeFromCart(itemId: string): Promise<ApiResponse<CartResponse>> {
  return await apiClient.delete<CartResponse>(`/cart/items/${itemId}`);
}

/**
 * 장바구니 전체 비우기
 * DELETE /cart
 */
export async function clearCart(): Promise<ApiResponse<void>> {
  return await apiClient.delete<void>('/cart');
}

/**
 * 장바구니 동기화 (로컬 → 서버)
 * POST /cart/sync
 */
export async function syncCart(items: CartItem[]): Promise<ApiResponse<CartResponse>> {
  return await apiClient.post<CartResponse>('/cart/sync', { items });
}
