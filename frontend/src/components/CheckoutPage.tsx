'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import { Container } from './common/Container';
// 포트원 SDK는 동적 import로 로드
// import PortOne from '@portone/browser-sdk/v2';
import { paymentService, PaymentRequestDTO } from '@/services/paymentService';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';
import { cartService } from '@/services/cartService';
import { CartItem, CartItemListDTO } from '@/types';

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
import * as process from "process";

interface AddressData {
  addressId?: string;
  name: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2?: string;
}

interface CheckoutPageProps {
  totalAmount: number;
  itemCount: number;
  onBack: () => void;
  onPaymentSuccess: () => void;
  // 추가: 결제 타입 및 상품 정보
  type?: 'cart' | 'buyNow';
  productId?: string;
  quantity?: number;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          address: string;
          addressEnglish: string;
          addressType: string;
          bname: string;
          buildingName: string;
        }) => void;
        width?: string;
        height?: string;
      }) => {
        open: () => void;
      };
    };
  }
}

export function CheckoutPage({ 
  totalAmount, 
  itemCount, 
  onBack, 
  onPaymentSuccess,
  type = 'cart',
  productId,
  quantity
}: CheckoutPageProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [portOneClientKey, setPortOneClientKey] = useState<string>('');
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [buyNowProduct, setBuyNowProduct] = useState<ProductDetailResponse | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { user } = useAuthStore();

  const deliveryFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount + deliveryFee;

  // 다음 우편번호 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 배송지 정보 로드
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const response = await apiClient.get<AddressData>('/v1/user/address');
        
        if (response.success && response.data) {
          // 기존 주소가 있으면 폼에 채우기
          setName(response.data.name || '');
          setPhone(response.data.phone || '');
          setZipCode(response.data.zipcode || '');
          setAddress(response.data.address1 || '');
          setDetailAddress(response.data.address2 || '');
        }
      } catch (error: unknown) {
        // 주소가 없으면 그냥 넘어감 (404 등)
        console.log('주소를 찾을 수 없습니다:', error);
      }
    };

    loadAddress();
  }, []);

  // CartItemListDTO를 CartItem으로 변환
  const convertToCartItem = (dto: CartItemListDTO): CartItem => {
    return {
      id: dto.cartItemId,
      name: dto.productName,
      price: dto.price,
      image: dto.imageUrl,
      brand: dto.brand,
      quantity: dto.quantity,
      products_id: dto.productId,
    };
  };

  // 주문 상품 정보 로드
  useEffect(() => {
    const loadOrderItems = async () => {
      setIsLoadingData(true);
      try {
        if (type === 'buyNow' && productId && quantity) {
          // 바로구매: 상품 정보 직접 조회
          const productResponse = await apiClient.get<ProductDetailResponse>(
            `/v1/user/productDetail?productId=${productId}`
          );
          if (productResponse.success && productResponse.data) {
            setBuyNowProduct(productResponse.data);
          }
        } else {
          // 장바구니: 장바구니 데이터 조회
          const cartResponse = await cartService.getCart();
          if (cartResponse.success && cartResponse.data) {
            // CartItemListDTO[]를 CartItem[]로 변환
            const items = cartResponse.data.map(convertToCartItem);
            setOrderItems(items);
          }
        }
      } catch (error) {
        console.error('주문 상품 정보 로드 실패:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadOrderItems();
  }, [type, productId, quantity]);

  // 포트원 Client Key 로드 (환경변수에서)
  useEffect(() => {
    const clientKey = process.env.NEXT_PUBLIC_PORTONE_CLIENT_KEY || '';
    if (!clientKey) {
      console.warn('포트원 Client Key가 설정되지 않았습니다.');
    }
    setPortOneClientKey(clientKey);
  }, []);

  // 우편번호 검색
  const handleSearchAddress = () => {
    if (!window.daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        setZipCode(data.zonecode);
        setAddress(data.address);
      },
      width: '100%',
      height: '100%',
    }).open();
  };

  const handlePayment = async () => {
    if (!name || !phone || !address || !zipCode) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    if (!agreedToTerms) {
      alert('구매 조건에 동의해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!portOneClientKey) {
      alert('결제 시스템 설정 오류가 발생했습니다.');
      return;
    }

    setIsLoadingPayment(true);

    try {
      // 1. 결제 요청 생성 (merchant_uid 생성)
      const paymentRequest: PaymentRequestDTO = {
        type: type || 'cart',  // type이 undefined일 경우 기본값 'cart' 사용
        productId: type === 'buyNow' ? productId : undefined,
        quantity: type === 'buyNow' ? quantity : undefined,
        recipientName: name,
        recipientPhone: phone,
        
        zipcode: zipCode,
        address1: address,
        address2: detailAddress || undefined,  // 빈 문자열이면 undefined로 변환
        paymentMethod: 'PORTONE',
        amount: finalAmount,
      };

      const requestResponse = await paymentService.createPaymentRequest(paymentRequest);

      if (!requestResponse.success || !requestResponse.data) {
        throw new Error(requestResponse.error || '결제 요청 생성에 실패했습니다.');
      }

      const { merchantUid, orderNumber } = requestResponse.data;

      // 2. 포트원 결제 요청 (동적 import)
      const PortOne = (await import('@portone/browser-sdk/v2')).default;
      // 주문명 생성
      let orderName = '';
      if (type === 'buyNow' && buyNowProduct) {
        orderName = `${buyNowProduct.name} ${quantity}개`;
      } else if (orderItems.length > 0) {
        if (orderItems.length === 1) {
          orderName = `${orderItems[0].name} 외 ${itemCount}개`;
        } else {
          orderName = `${orderItems[0].name} 외 ${orderItems.length - 1}개`;
        }
      } else {
        orderName = `강아지 간식 ${itemCount}개`;
      }

      const payment = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || '',
        channelKey: portOneClientKey,
        paymentId: merchantUid, // merchant_uid를 paymentId로 사용
        orderName,
        totalAmount: finalAmount,
        currency: 'KRW',
        payMethod: 'CARD',
        customData: {
          orderNumber,
          type,
        },
      });

      // 결제 실패 처리
      if (!payment || payment.code !== undefined) {
        setIsLoadingPayment(false);
        alert(`결제 실패: ${payment?.message || '알 수 없는 오류가 발생했습니다.'}`);
        return;
      }

      // 3. 결제 승인 처리 (백엔드에 결제 정보 전달)
      const confirmResponse = await paymentService.confirmPayment({
        impUid: payment.paymentId, // 포트원에서 받은 paymentId (imp_uid)
        merchantUid: merchantUid,
        amount: finalAmount,
        // 배송지 정보 추가
        recipientName: name,
        recipientPhone: phone,
        zipcode: zipCode,
        address1: address,
        address2: detailAddress || undefined,
        // 주문 정보 추가
        type: type || 'cart',
        productId: productId,
        quantity: quantity
      });

      if (!confirmResponse.success) {
        // 결제 승인 실패 시 포트원 결제 취소 필요 (선택사항)
        alert(`결제 승인 실패: ${confirmResponse.error || '알 수 없는 오류가 발생했습니다.'}`);
        setIsLoadingPayment(false);
        return;
      }

      // 결제 성공
      setIsLoadingPayment(false);
      alert(`결제가 완료되었습니다!\n\n주문번호: ${orderNumber}\n결제금액: ${finalAmount.toLocaleString()}원`);
      onPaymentSuccess();

    } catch (error) {
      setIsLoadingPayment(false);
      console.error('결제 처리 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      alert(`결제 중 오류가 발생했습니다: ${errorMessage}`);
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
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                >
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
                placeholder="주소를 검색해주세요"
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
          {isLoadingData ? (
            <div className="text-sm text-gray-600">로딩 중...</div>
          ) : type === 'buyNow' && buyNowProduct ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                {buyNowProduct.imageUrl && (
                  <img
                    src={buyNowProduct.imageUrl}
                    alt={buyNowProduct.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{buyNowProduct.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{buyNowProduct.brand}</div>
                  <div className="text-sm text-gray-900 mt-2">
                    {buyNowProduct.price?.toLocaleString()}원 × {quantity}개
                  </div>
                </div>
              </div>
            </div>
          ) : orderItems.length > 0 ? (
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {/*{item.image && (*/}
                  {/*  <img*/}
                  {/*    src={item.image}*/}
                  {/*    alt={item.name}*/}
                  {/*    className="w-20 h-20 object-cover rounded-lg"*/}
                  {/*  />*/}
                  {/*)}*/}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    {item.brand && (
                      <div className="text-xs text-gray-500 mt-1">{item.brand}</div>
                    )}
                    <div className="text-sm text-gray-900 mt-2">
                      {item.price.toLocaleString()}원 × {item.quantity}개
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">주문할 상품이 없습니다.</div>
          )}
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
              <span className="text-gray-900">포트원 결제</span>
            </button>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
              <div className="flex items-start gap-2">
                <span>💳</span>
                <div>
                  <div className="mb-1">포트원으로 간편하고 안전하게 결제하세요</div>
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
            <li>• 결제는 포트원을 통해 안전하게 처리됩니다</li>
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
