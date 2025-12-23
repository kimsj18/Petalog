'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutPage } from "@/components/CheckoutPage";
import { getCart } from "@/services/cart";

export default function CheckoutRoute() {
  const router = useRouter();
  const [totalAmount, setTotalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const response = await getCart();
        if (response.success && response.data) {
          setTotalAmount(response.data.totalAmount);
          setItemCount(response.data.itemCount);
        }
      } catch (error) {
        console.error('장바구니 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handlePaymentSuccess = () => {
    // 결제 성공 후 홈으로 리다이렉트
    router.push('/');
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
    />
  );
}