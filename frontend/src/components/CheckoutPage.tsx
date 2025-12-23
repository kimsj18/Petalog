'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { Container } from './common/Container';

interface CheckoutPageProps {
  totalAmount: number;
  itemCount: number;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export function CheckoutPage({ totalAmount, itemCount, onBack, onPaymentSuccess }: CheckoutPageProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const deliveryFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount + deliveryFee;

  // 토스페이먼츠 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment-widget';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!name || !phone || !address || !zipCode) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    if (!agreedToTerms) {
      alert('구매 조건에 동의해주세요.');
      return;
    }

    setIsLoadingPayment(true);

    // 실제 토스페이먼츠 연동 시 사용할 코드 (현재는 시뮬레이션)
    try {
      // TODO: 실제 토스페이먼츠 SDK 사용
      // const tossPayments = await loadTossPayments('YOUR_CLIENT_KEY');
      // await tossPayments.requestPayment('카드', {
      //   amount: finalAmount,
      //   orderId: 'ORDER_' + Date.now(),
      //   orderName: `강아지 간식 ${itemCount}개`,
      //   customerName: name,
      //   successUrl: window.location.origin + '/payment/success',
      //   failUrl: window.location.origin + '/payment/fail',
      // });

      // 시뮬레이션: 2초 후 성공
      setTimeout(() => {
        setIsLoadingPayment(false);
        alert(`결제가 완료되었습니다!\n\n주문자: ${name}\n결제금액: ${finalAmount.toLocaleString()}원\n배송지: ${address} ${detailAddress}`);
        onPaymentSuccess();
      }, 2000);
    } catch (error) {
      setIsLoadingPayment(false);
      alert('결제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <Container size="narrow">
          <div className="py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-gray-700 hover:text-gray-900">
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-gray-900">주문/결제</h1>
        </div>
        </Container>
      </div>

      <Container size="narrow">
        <div className="py-6 space-y-6">
        {/* 배송지 정보 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">배송지 정보</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">받는 분</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">연락처</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">우편번호</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="12345"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                  우편번호 찾기
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">주소</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="주소를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">상세주소</label>
              <input
                type="text"
                value={detailAddress}
                onChange={(e) => setDetailAddress(e.target.value)}
                placeholder="상세주소를 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* 주문 상품 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">주문 상품</h3>
          <div className="text-sm text-gray-600">
            강아지 간식 {itemCount}개
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">결제 수단</h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-4 border-2 border-blue-600 bg-blue-50 rounded-lg">
              <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              </div>
              <CreditCard className="size-5 text-blue-600" />
              <span className="text-gray-900">토스페이</span>
            </button>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              <div className="flex items-start gap-2">
                <span>💳</span>
                <div>
                  <div className="mb-1">토스페이로 간편하고 안전하게 결제하세요</div>
                  <div className="text-blue-600">카드, 계좌이체, 휴대폰 결제 등 다양한 결제 수단을 지원합니다</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
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
          </div>
          
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-gray-900">최종 결제 금액</span>
            <span className="text-blue-600 text-xl">{finalAmount.toLocaleString()}원</span>
          </div>
        </div>

        {/* 동의 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                agreedToTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}>
                {agreedToTerms && <Check className="size-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-900 mb-1">주문 내용을 확인했으며, 결제에 동의합니다</div>
              <div className="text-xs text-gray-500">
                개인정보 제공 및 구매조건, 결제 대행 서비스 약관에 동의합니다
              </div>
            </div>
          </label>
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={isLoadingPayment || !agreedToTerms}
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoadingPayment ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              결제 처리 중...
            </>
          ) : (
            <>
              <CreditCard className="size-5" />
              {finalAmount.toLocaleString()}원 결제하기
            </>
          )}
        </button>

        {/* 안내사항 */}
        <div className="bg-gray-100 rounded-lg p-4 text-xs text-gray-600">
          <div className="mb-2">💡 안내사항</div>
          <ul className="space-y-1">
            <li>• 결제는 토스페이먼츠를 통해 안전하게 처리됩니다</li>
            <li>• 결제 후 주문 내역은 마이페이지에서 확인하실 수 있습니다</li>
            <li>• 배송은 결제 완료 후 2-3일 소요됩니다</li>
            <li>• 제품 수령 후 7일 이내 반품 가능합니다</li>
          </ul>
        </div>
      </div>
      </Container>
    </div>
  );
}
