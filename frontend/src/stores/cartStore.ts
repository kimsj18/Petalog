import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService, AddToCartRequest } from '@/services/cartService';
import { CartItem, Cart } from '@/types';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  
  // Actions
  loadCart: () => Promise<void>;
  addToCart: (product: AddToCartRequest & { name: string; brand: string; price: number; image: string }) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<void>;
  removeItem: (cartId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// Cart를 CartItem으로 변환하는 헬퍼 함수
const convertCartToCartItem = (cart: Cart): CartItem => {
  return {
    id: cart.cart_id,
    products_id: cart.products_id,
    name: cart.product?.name || '상품명',
    brand: cart.product?.brand || '브랜드',
    price: cart.product?.price || 0,
    image: cart.product?.imageUrl || '',
    quantity: cart.quantity,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      loadCart: async () => {
        set({ isLoading: true });
        try {
          const response = await cartService.getCart();
          
          if (response.success && response.data) {
            const cartItems = response.data.map(convertCartToCartItem);
            set({ items: cartItems, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Load cart error:', error);
          set({ isLoading: false });
        }
      },

      addToCart: async (product) => {
        set({ isLoading: true });
        try {
          const response = await cartService.addToCart({
            products_id: product.products_id,
            quantity: product.quantity,
          });
          
          if (response.success) {
            // 장바구니 다시 로드
            await get().loadCart();
          } else {
            throw new Error(response.error || '장바구니 추가에 실패했습니다.');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateQuantity: async (cartId: string, quantity: number) => {
        if (quantity < 1) return;
        
        set({ isLoading: true });
        try {
          const response = await cartService.updateCartQuantity(cartId, quantity);
          
          if (response.success) {
            // 로컬 상태 업데이트
            set((state) => ({
              items: state.items.map(item =>
                item.id === cartId ? { ...item, quantity } : item
              ),
              isLoading: false,
            }));
          } else {
            throw new Error(response.error || '수량 변경에 실패했습니다.');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      removeItem: async (cartId: string) => {
        set({ isLoading: true });
        try {
          const response = await cartService.removeFromCart(cartId);
          
          if (response.success) {
            set((state) => ({
              items: state.items.filter(item => item.id !== cartId),
              isLoading: false,
            }));
          } else {
            throw new Error(response.error || '삭제에 실패했습니다.');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          const response = await cartService.clearCart();
          
          if (response.success) {
            set({ items: [], isLoading: false });
          } else {
            throw new Error(response.error || '장바구니 비우기에 실패했습니다.');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage', // localStorage 키
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

// Computed values를 위한 selector
export const useCartTotal = () => {
  const items = useCartStore((state) => state.items);
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

export const useCartItemCount = () => {
  const items = useCartStore((state) => state.items);
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

