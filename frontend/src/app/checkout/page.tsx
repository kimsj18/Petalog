'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { CheckoutPage } from "@/components/CheckoutPage";
import { cartService } from "@/services/cartService";
import { apiClient } from "@/lib/api";

// 백엔드 응답 타입
interface ProductDetailResponse {
  productsId: string;
  name: string;
  brand: string;
  category: string;
  snackType: string;
  imageUrl: string;
  madeIn: string;
  quantity: number;
  size: number;
  price: number;
  description: string;
  ingredientDTOs: Array<{
    name: string;
    percentage: number;
  }>;
  benefitDTOs: Array<{
    name: string;
  }>;
}

function CheckoutRouteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const productId = searchParams.get('productId');
  const quantity = searchParams.get('quantity');

  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadBuyNowData = async (productId: string, quantity: number) => {
    try {
      const response = await apiClient.get<ProductDetailResponse>(
        `/v1/user/productDetail?productId=${productId}`
      );
      if (response.success && response.data) {
        const product = response.data;
        const price = product.price || 0;
        setTotalAmount(price * quantity);
        setItemCount(quantity);
      }
    } catch (error) {
      console.error('상품 정보 조회 실패:', error);
    }
  };

  const loadCartData = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success && response.data) {
        const items = response.data;
        // 총 금액 계산
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // 총 개수 계산
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setTotalAmount(total);
        setItemCount(count);
      }
    } catch (error) {
      console.error('장바구니 데이터 로드 실패:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (type === 'buyNow' && productId && quantity) {
          // 바로구매: 상품 정보 직접 조회
          await loadBuyNowData(productId, parseInt(quantity));
        } else {
          // 장바구니: 장바구니 데이터 조회
          await loadCartData();
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, productId, quantity]);

  const handleBack = () => {
    router.back();
  };

  const handlePaymentSuccess = () => {
    // 결제 성공 후 주문 내역 페이지로 리다이렉트
    router.push('/user/orderHistory');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <CheckoutPage
      totalAmount={totalAmount}
      itemCount={itemCount}
      onBack={handleBack}
      onPaymentSuccess={handlePaymentSuccess}
      type={type === 'buyNow' ? 'buyNow' : 'cart'}
      productId={productId || undefined}
      quantity={quantity ? parseInt(quantity) : undefined}
    />
  );
}

export default function CheckoutRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    }>
      <CheckoutRouteContent />
    </Suspense>
  );
}