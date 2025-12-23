'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Star, 
  Share2,
  ShoppingCart,
  ChevronRight,
  AlertCircle,
  Check,
  MessageSquare,
  Package,
  Shield,
  Truck
} from 'lucide-react';
import { Product } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { mockProducts } from '../../data/mockData';
import { Container } from '../common/Container';

interface ProductDetailPageProps {
  productId: string;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedTab, setSelectedTab] = useState<'info' | 'ingredients' | 'reviews'>('info');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // TODO: API 호출로 변경
    // const response = await productService.getProductById(productId);
    // setProduct(response.data);
    
    // 현재는 Mock 데이터 사용
    const foundProduct = mockProducts.find(p => p.products_id === productId);
    setProduct(foundProduct || null);
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">상품을 불러오는 중...</div>
      </div>
    );
  }

  const discountRate = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const totalPrice = (product.price ?? 0) * quantity;

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = () => {
    // TODO: API 호출
    // await cartService.addToCart({ products_id: productId, quantity });
    alert(`${quantity}개를 장바구니에 추가했습니다!`);
  };

  const handleBuyNow = () => {
    // TODO: 결제 페이지로 이동
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.brand} - ${product.name}`,
        url: window.location.href,
      });
    } else {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
    }
  };

  // 임시 리뷰 데이터
  const reviews = [
    {
      id: '1',
      userName: '김**',
      rating: 5,
      date: '2024.01.15',
      content: '우리 강아지가 너무 좋아해요! 소화도 잘 되고 알러지도 없어요.',
      helpful: 24,
    },
    {
      id: '2',
      userName: '이**',
      rating: 4,
      date: '2024.01.10',
      content: '가격 대비 품질이 좋습니다. 재구매 의사 있어요.',
      helpful: 12,
    },
    {
      id: '3',
      userName: '박**',
      rating: 5,
      date: '2024.01.05',
      content: '알러지가 있는 아이에게 딱이에요. 성분도 깔끔하고 좋습니다.',
      helpful: 18,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen">
        {/* 헤더 */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <Container size="narrow">
            <div className="flex items-center justify-between py-3">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="size-6 text-gray-900" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="size-6 text-gray-900" />
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* 제품 이미지 */}
        <div className="relative aspect-square bg-gray-50">
          <ImageWithFallback
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discountRate > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg">
              <span className="text-lg">{discountRate}%</span>
            </div>
          )}
        </div>

        {/* 제품 기본 정보 */}
        <Container size="narrow">
          <div className="py-6 border-b border-gray-200">
          <div className="text-sm text-blue-600 mb-2">{product.brand}</div>
          <h1 className="text-xl text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-900">{product.rating ?? 0}</span>
            </div>
            <span className="text-gray-500">
              리뷰 {(product.reviewCount ?? 0).toLocaleString()}개
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {product.benefits?.map(benefit => (
              <span
                key={benefit.benefit_id}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
              >
                {benefit.benefit_name}
              </span>
            )) ?? <span className="text-sm text-gray-500">효능 정보 없음</span>}
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-baseline gap-2 mb-2">
              {product.originalPrice && (
                <span className="text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()}원
                </span>
              )}
              {discountRate > 0 && (
                <span className="text-red-500">{discountRate}%</span>
              )}
            </div>
            <div className="text-2xl text-gray-900">
              {(product.price ?? 0).toLocaleString()}원
            </div>
          </div>
        </div>
        </Container>

        {/* 배송/혜택 정보 */}
        <Container size="narrow">
          <div className="py-4 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="size-5 text-gray-400 shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-gray-900">무료배송</div>
                <div className="text-xs text-gray-500">2-3일 내 도착 예정</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="size-5 text-gray-400 shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-gray-900">100% 정품 보장</div>
                <div className="text-xs text-gray-500">신뢰할 수 있는 판매자</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="size-5 text-gray-400 shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-gray-900">무료 반품/교환</div>
                <div className="text-xs text-gray-500">30일 이내 가능</div>
              </div>
            </div>
          </div>
        </div>
        </Container>

        {/* 탭 메뉴 */}
        <div className="sticky top-[57px] z-40 bg-white border-b border-gray-200">
          <Container size="narrow">
            <div className="flex">
            <button
              onClick={() => setSelectedTab('info')}
              className={`flex-1 px-4 py-3 border-b-2 transition-colors ${
                selectedTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              상품정보
            </button>
            <button
              onClick={() => setSelectedTab('ingredients')}
              className={`flex-1 px-4 py-3 border-b-2 transition-colors ${
                selectedTab === 'ingredients'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              원재료/성분
            </button>
            <button
              onClick={() => setSelectedTab('reviews')}
              className={`flex-1 px-4 py-3 border-b-2 transition-colors ${
                selectedTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              리뷰 {product.reviewCount ?? 0}
            </button>
          </div>
          </Container>
        </div>

        {/* 탭 컨텐츠 */}
        <Container size="narrow">
          <div className="py-6 pb-32">
          {/* 상품정보 탭 */}
          {selectedTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg text-gray-900 mb-4">제품 상세</h2>
                <div className="space-y-3">
                  <div className="flex py-2 border-b border-gray-100">
                    <div className="w-24 text-sm text-gray-500">용량</div>
                    <div className="flex-1 text-sm text-gray-900">{product.size}</div>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <div className="w-24 text-sm text-gray-500">원산지</div>
                    <div className="flex-1 text-sm text-gray-900">{product.madeIn}</div>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <div className="w-24 text-sm text-gray-500">적합 연령</div>
                    <div className="flex-1 text-sm text-gray-900">{product.ageGroup?.join(', ') ?? '-'}</div>
                  </div>
                  <div className="flex py-2 border-b border-gray-100">
                    <div className="w-24 text-sm text-gray-500">브랜드</div>
                    <div className="flex-1 text-sm text-gray-900">{product.brand}</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg text-gray-900 mb-4">효능</h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.benefits?.map(benefit => (
                    <div
                      key={benefit.benefit_id}
                      className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                    >
                      <Check className="size-5 text-blue-600 shrink-0" />
                      <span className="text-sm text-gray-900">{benefit.benefit_name}</span>
                    </div>
                  )) ?? <div className="text-sm text-gray-500">효능 정보 없음</div>}
                </div>
              </div>
            </div>
          )}

          {/* 원재료/성분 탭 */}
          {selectedTab === 'ingredients' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg text-gray-900 mb-4">원재료</h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients?.map((ingredient, idx) => (
                      <div key={ingredient.ingredients_id} className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{ingredient.ingredients_name}</span>
                        {idx < (product.ingredients?.length ?? 0) - 1 && (
                          <span className="text-gray-300">•</span>
                        )}
                      </div>
                    )) ?? <span className="text-sm text-gray-500">원재료 정보 없음</span>}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg text-gray-900 mb-4">성분 분석</h2>
                <div className="space-y-3">
                  {product.ingredients?.slice(0, 5).map((ingredient, idx) => (
                    <div key={ingredient.ingredients_id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-900">{ingredient.ingredients_name}</span>
                        <span className="text-sm text-gray-500">
                          {Math.round((5 - idx) * 15)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(5 - idx) * 15}%` }}
                        />
                      </div>
                    </div>
                  )) ?? <div className="text-sm text-gray-500">성분 정보 없음</div>}
                </div>
              </div>

              {product.ingredients && product.ingredients.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="size-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm text-yellow-900 mb-1">알러지 주의</h3>
                      <p className="text-sm text-yellow-700">
                        해당 제품은 {product.ingredients[0].ingredients_name}을(를) 포함하고 있습니다. 
                        알러지가 있는 반려견은 주의해주세요.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 리뷰 탭 */}
          {selectedTab === 'reviews' && (
            <div className="space-y-6">
              {/* 리뷰 요약 */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl text-blue-900 mb-2">{product.rating ?? 0}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`size-5 ${
                          star <= Math.round(product.rating ?? 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-blue-700">
                    {(product.reviewCount ?? 0).toLocaleString()}개의 리뷰
                  </div>
                </div>
              </div>

              {/* 리뷰 작성 버튼 */}
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="size-5" />
                리뷰 작성하기
              </button>

              {/* 리뷰 목록 */}
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{review.userName}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`size-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{review.content}</p>
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      도움이 돼요 {review.helpful}
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                리뷰 더보기
              </button>
            </div>
          )}
          </div>
        </Container>

        {/* 하단 구매 바 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <Container size="narrow">
            <div className="py-4">
            {/* 수량 선택 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-700">수량</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-8 text-center text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* 총 금액 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-700">총 금액</span>
              <span className="text-xl text-blue-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-xl border transition-colors flex items-center justify-center border-gray-300 hover:bg-gray-50"
              >
                <Share2 className="size-6 text-gray-700" />
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gray-100 text-gray-900 h-12 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="size-5" />
                장바구니
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-blue-600 text-white h-12 rounded-xl hover:bg-blue-700 transition-colors"
              >
                구매하기
              </button>
            </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}