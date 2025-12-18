import { apiClient, ApiResponse } from './api';
import { CartItem } from '../components/CartPage';

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
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<CartResponse>('/cart');

  // 현재: localStorage에서 장바구니 불러오기 (Mock)
  await new Promise(resolve => setTimeout(resolve, 200));

  const cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]') as CartItem[];
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    success: true,
    data: {
      items: cartItems,
      totalAmount,
      itemCount,
    },
  };
}

/**
 * 장바구니에 상품 추가
 * POST /cart/items
 */
export async function addToCart(item: AddToCartRequest): Promise<ApiResponse<CartResponse>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.post<CartResponse>('/cart/items', item);

  // 현재: localStorage 사용 (Mock)
  await new Promise(resolve => setTimeout(resolve, 300));

  const cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]') as CartItem[];
  
  // 기존 아이템 찾기
  const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.productId);
  
  if (existingItemIndex > -1) {
    // 기존 아이템의 수량 증가
    cartItems[existingItemIndex].quantity += item.quantity;
  } else {
    // 새 아이템 추가 (실제로는 productId로 상품 정보를 가져와야 함)
    // 여기서는 간단히 Mock 처리
    const newItem: CartItem = {
      id: item.productId,
      name: '상품명', // TODO: 실제 상품 정보로 교체
      brand: '브랜드',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
      quantity: item.quantity,
    };
    cartItems.push(newItem);
  }

  localStorage.setItem('cart_items', JSON.stringify(cartItems));

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    success: true,
    data: {
      items: cartItems,
      totalAmount,
      itemCount,
    },
  };
}

/**
 * 장바구니 아이템 수량 수정
 * PATCH /cart/items/:itemId
 */
export async function updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<ApiResponse<CartResponse>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.patch<CartResponse>(`/cart/items/${itemId}`, data);

  // 현재: localStorage 사용 (Mock)
  await new Promise(resolve => setTimeout(resolve, 200));

  const cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]') as CartItem[];
  const itemIndex = cartItems.findIndex(item => item.id === itemId);

  if (itemIndex > -1) {
    if (data.quantity === 0) {
      // 수량이 0이면 삭제
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = data.quantity;
    }
  }

  localStorage.setItem('cart_items', JSON.stringify(cartItems));

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    success: true,
    data: {
      items: cartItems,
      totalAmount,
      itemCount,
    },
  };
}

/**
 * 장바구니 아이템 삭제
 * DELETE /cart/items/:itemId
 */
export async function removeFromCart(itemId: string): Promise<ApiResponse<CartResponse>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.delete<CartResponse>(`/cart/items/${itemId}`);

  // 현재: localStorage 사용 (Mock)
  await new Promise(resolve => setTimeout(resolve, 200));

  const cartItems = JSON.parse(localStorage.getItem('cart_items') || '[]') as CartItem[];
  const filteredItems = cartItems.filter(item => item.id !== itemId);

  localStorage.setItem('cart_items', JSON.stringify(filteredItems));

  const totalAmount = filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    success: true,
    data: {
      items: filteredItems,
      totalAmount,
      itemCount,
    },
  };
}

/**
 * 장바구니 전체 비우기
 * DELETE /cart
 */
export async function clearCart(): Promise<ApiResponse<void>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.delete<void>('/cart');

  // 현재: localStorage 사용 (Mock)
  await new Promise(resolve => setTimeout(resolve, 200));

  localStorage.removeItem('cart_items');

  return {
    success: true,
  };
}

/**
 * 장바구니 동기화 (로컬 → 서버)
 * POST /cart/sync
 */
export async function syncCart(items: CartItem[]): Promise<ApiResponse<CartResponse>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.post<CartResponse>('/cart/sync', { items });

  // 현재: localStorage 사용 (Mock)
  await new Promise(resolve => setTimeout(resolve, 300));

  localStorage.setItem('cart_items', JSON.stringify(items));

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    success: true,
    data: {
      items,
      totalAmount,
      itemCount,
    },
  };
}
