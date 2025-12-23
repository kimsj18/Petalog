'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Container } from '../common/Container';
import { useCartStore } from '@/stores/cartStore';
import { CartItem } from '@/types';

export function CartPage() {
  const router = useRouter();
  const { items: cartItems, isLoading, loadCart, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleBack = () => {
    router.back();
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(id, newQuantity);
    } catch (error: any) {
      alert(error.message || '수량 변경에 실패했습니다.');
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeItem(id);
    } catch (error: any) {
      alert(error.message || '삭제에 실패했습니다.');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <Container size="narrow">
          <div className="py-4 flex items-center gap-4">
          <button onClick={handleBack} className="text-gray-700 hover:text-gray-900">
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-gray-900">장바구니</h1>
        </div>
        </Container>
      </div>

      <Container size="narrow">
        <div className="py-6">
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">장바구니를 불러오는 중...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="size-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">장바구니가 비어있습니다</p>
            <button
              onClick={handleBack}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              쇼핑 계속하기
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-blue-600 mb-1">{item.brand}</div>
                      <h3 className="text-gray-900 mb-2 line-clamp-2 text-sm">{item.name}</h3>
                      <div className="text-gray-900 mb-3">{item.price.toLocaleString()}원</div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-gray-300 rounded">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600">상품 금액</span>
                    <span className="text-gray-900">{(item.price * item.quantity).toLocaleString()}원</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <h3 className="text-gray-900 mb-4">결제 금액</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="text-gray-900">{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">배송비</span>
                  <span className="text-gray-900">
                    {deliveryFee === 0 ? '무료' : `${deliveryFee.toLocaleString()}원`}
                  </span>
                </div>
                {totalAmount < 50000 && (
                  <div className="text-xs text-blue-600">
                    {(50000 - totalAmount).toLocaleString()}원 추가 시 무료배송
                  </div>
                )}
              </div>
              
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-gray-900">총 결제 금액</span>
                <span className="text-blue-600 text-xl">{finalAmount.toLocaleString()}원</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {finalAmount.toLocaleString()}원 결제하기
            </button>

            {/* Notice */}
            <div className="mt-6 bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
              <ul className="space-y-1">
                <li>• 50,000원 이상 구매 시 무료배송</li>
                <li>• 배송은 평균 2-3일 소요됩니다</li>
                <li>• 제품 수령 후 7일 이내 반품 가능합니다</li>
              </ul>
            </div>
          </>
        )}
      </div>
      </Container>
    </div>
  );
}