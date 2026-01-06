'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Container } from '../common/Container';
import { useCartStore } from '@/stores/cartStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

// 이미지 URL 변환 함수
const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('/')) {
    const backendUrl = typeof window !== 'undefined' 
      ? (window.location.hostname === 'localhost' 
          ? 'http://localhost:8080' 
          : `${window.location.protocol}//${window.location.hostname}:8080`)
      : 'http://localhost:8080';
    return `${backendUrl}${imageUrl}`;
  }
  
  return imageUrl;
};

export function CartPage() {
  const router = useRouter();
  const { items: cartItems, isLoading, loadCart, updateQuantity, removeItem } = useCartStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [quantityInputs, setQuantityInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // 장바구니 아이템이 로드되면 입력값 초기화
  useEffect(() => {
    const initialInputs: Record<string, string> = {};
    cartItems.forEach(item => {
      initialInputs[item.id] = item.quantity.toString();
    });
    setQuantityInputs(initialInputs);
  }, [cartItems]);

  const handleBack = () => {
    router.back();
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(id, newQuantity);
      setQuantityInputs(prev => ({ ...prev, [id]: newQuantity.toString() }));
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : '수량 변경에 실패했습니다.');
      // 에러 발생 시 원래 값으로 복구
      const item = cartItems.find(i => i.id === id);
      if (item) {
        setQuantityInputs(prev => ({ ...prev, [id]: item.quantity.toString() }));
      }
    }
  };

  const handleQuantityInputChange = (id: string, value: string) => {
    // 숫자만 입력 허용
    if (value === '' || /^\d+$/.test(value)) {
      setQuantityInputs(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleQuantityInputBlur = (id: string) => {
    const inputValue = quantityInputs[id];
    if (!inputValue || inputValue === '') {
      // 빈 값이면 1로 설정
      handleUpdateQuantity(id, 1);
    } else {
      const numValue = parseInt(inputValue, 10);
      if (isNaN(numValue) || numValue < 1) {
        handleUpdateQuantity(id, 1);
      } else {
        handleUpdateQuantity(id, numValue);
      }
    }
  };

  const handleQuantityInputKeyDown = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleRemoveClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleRemoveItem = async () => {
    if (!itemToDelete) return;
    try {
      await removeItem(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : '삭제에 실패했습니다.');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCheckout = () => {
    // 결제 페이지로 이동 (장바구니)
    router.push('/checkout?type=cart');
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
              {cartItems.map((item) => {
                // imageUrl이 쉼표로 구분된 여러 이미지일 수 있으므로 첫 번째 이미지만 사용
                const firstImageUrl = item.image 
                  ? item.image.split(',')[0].trim() 
                  : '';
                
                // 상대 경로를 전체 URL로 변환
                const fullImageUrl = getImageUrl(firstImageUrl);

                return (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <ImageWithFallback
                        src={fullImageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/*<div className="text-xs text-blue-600 mb-1">{item.brand}</div>*/}
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
                          <input
                            type="text"
                            value={quantityInputs[item.id] || item.quantity.toString()}
                            onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                            onBlur={() => handleQuantityInputBlur(item.id)}
                            onKeyDown={(e) => handleQuantityInputKeyDown(item.id, e)}
                            className="text-sm w-12 text-center border-0 outline-none focus:outline-none bg-transparent"
                            min="1"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveClick(item.id)}
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
                );
              })}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">상품 삭제</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              정말로 이 상품을 장바구니에서 삭제하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              아니오
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveItem}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              예
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}