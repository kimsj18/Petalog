'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Star,
  Share2,
  ShoppingCart,
  AlertCircle,
  Check,
  MessageSquare,
  Package,
  Shield,
  Truck, StarHalf,
  Pencil
} from 'lucide-react';
import { Product } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Container } from '../common/Container';
import { apiClient } from '../../lib/api';
import { ReviewForm } from './ReviewForm';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { orderService } from '../../services/orderService';


// 이미지 URL 변환 함수: 상대 경로를 전체 URL로 변환
const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return '';
  
  // 이미 전체 URL인 경우 (http:// 또는 https://로 시작)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // 상대 경로인 경우 (/uploads/...)
  if (imageUrl.startsWith('/')) {
    // 백엔드 서버 URL
    // Next.js에서는 클라이언트 사이드에서 환경 변수 접근이 제한적이므로
    // 기본값으로 localhost:8080 사용 (프로덕션에서는 환경 변수 설정 필요)
    const backendUrl = typeof window !== 'undefined' 
      ? (window.location.hostname === 'localhost' 
          ? 'http://localhost:8080' 
          : `${window.location.protocol}//${window.location.hostname}:8080`)
      : 'http://localhost:8080';
    return `${backendUrl}${imageUrl}`;
  }
  
  return imageUrl;
};

interface ProductDetailPageProps {
  productId: string;
}

interface ReviewDTO {
  id: string;
  title: string;
  content: string;
  score: number;
  userName: string;
  userId: string;
  createdAt: string;
}

interface ReviewSummaryDTO{
  reviewCount: number;
  reviewAvg: number;
}

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

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'info' | 'ingredients' | 'reviews'>('info');
  const [quantity, setQuantity] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewLoaded, setReviewLoaded] = useState(false); // ⭐ 핵심
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryDTO>();
  const [myReview, setMyReview] = useState<ReviewDTO | null>(null);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [checkingPurchase, setCheckingPurchase] = useState<boolean>(false);

  const fetchReviewSummary = async() => {
    try{

      const response = await apiClient.get<ReviewSummaryDTO>(
        `/v1/products/${productId}/reviewSummary`
      );

      setReviewSummary(response.data);
      // console.log("리뷰스코어평균", response.data?.reviewAvg);
    }catch(e){
      console.error(e)
    }
  }

  useEffect(() => {



    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get<ProductDetailResponse>(
          `/v1/user/productDetail?productId=${productId}`
        );

        if (!response.success || !response.data) {
          throw new Error(response.error || '상품을 불러올 수 없습니다.');
        }

        const data = response.data;
        console.log(data)

        // 이미지 URL 파싱 (콤마로 구분된 문자열을 배열로 변환)
        const parsedImageUrls = data.imageUrl 
          ? data.imageUrl.split(',').map(url => url.trim()).filter(url => url.length > 0).map(url => getImageUrl(url))
          : [];
        setImageUrls(parsedImageUrls);
        
        // 백엔드 응답을 프론트엔드 Product 타입으로 변환
        const convertedProduct: Product = {
          products_id: data.productsId,
          name: data.name,
          brand: data.brand,
          category: data.category,
          snack_type: data.snackType,
          imageUrl: parsedImageUrls[0] || data.imageUrl, // 첫 번째 이미지를 기본으로
          madeIn: data.madeIn,
          quantity: data.quantity,
          size: String(data.size),
          price: data.price,
          // ingredients 변환
          ingredients: data.ingredientDTOs?.map((ing, index) => ({
            ingredients_id: `ing_${data.productsId}_${index}`,
            products_id: data.productsId,
            ingredients_name: ing.name,
            ingredients_percentage: ing.percentage,
          })) || [],
          // benefits 변환
          benefits: data.benefitDTOs?.map((ben, index) => ({
            benefit_id: `ben_${data.productsId}_${index}`,
            products_id: data.productsId,
            benefit_name: ben.name,
          })) || [],

        };

        setProduct(convertedProduct);

      } catch (err) {
        console.error('상품 조회 오류:', err);
        setError(err instanceof Error ? err.message : '상품을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);


  useEffect(() => {
    if(productId){
      fetchReviewSummary();
  }
  }, [productId]);


  useEffect(() => {
    if (selectedTab === 'reviews' && !reviewLoaded) {
      fetchReviews();

    }
  }, [selectedTab]);

  // 구매 여부 확인 함수
  const checkIfPurchased = useCallback(async () => {
    if (!isAuthenticated || !user?.user_id) {
      setHasPurchased(false);
      return;
    }

    try {
      setCheckingPurchase(true);
      const ordersResponse = await orderService.getUserOrders();
      
      if (!ordersResponse.success || !ordersResponse.data) {
        setHasPurchased(false);
        return;
      }

      const orders = ordersResponse.data;
      
      // 모든 주문의 아이템을 확인
      for (const order of orders) {
        const itemsResponse = await orderService.getOrderItems(order.orderId);
        
        if (itemsResponse.success && itemsResponse.data) {
          const hasProduct = itemsResponse.data.some(
            item => item.productsId === productId
          );
          
          if (hasProduct) {
            setHasPurchased(true);
            setCheckingPurchase(false);
            return;
          }
        }
      }
      
      setHasPurchased(false);
    } catch (error) {
      console.error('구매 여부 확인 오류:', error);
      setHasPurchased(false);
    } finally {
      setCheckingPurchase(false);
    }
  }, [isAuthenticated, user?.user_id, productId]);

  // 로그인 상태나 상품 ID가 변경될 때 구매 여부 확인
  useEffect(() => {
    if (isAuthenticated && productId) {
      checkIfPurchased();
    } else {
      setHasPurchased(false);
    }
  }, [isAuthenticated, productId, checkIfPurchased]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">상품을 불러오는 중...</div>
      </div>
    );
  }

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);

      const response = await apiClient.get<ReviewDTO[]>(
          `/v1/products/${productId}/reviewAll`
      );

      if (!response.success || !response.data) return;

      const allReviews = response.data;
      
      // 내 리뷰 찾기 (userId로 비교)
      if (isAuthenticated && user?.user_id) {
        console.log('현재 사용자 userId:', user.user_id);
        console.log('모든 리뷰:', allReviews);
        const foundMyReview = allReviews.find(
          review => review.userId === user.user_id
        );
        console.log('찾은 내 리뷰:', foundMyReview);
        setMyReview(foundMyReview || null);
      } else {
        setMyReview(null);
      }

      // 내 리뷰를 제외한 다른 리뷰들만 표시
      const otherReviews = isAuthenticated && user?.user_id
        ? allReviews.filter(review => review.userId !== user.user_id)
        : allReviews;

      setReviews(otherReviews);
      setReviewLoaded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setReviewLoading(false);
    }
  };



  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-2">{error || '상품을 찾을 수 없습니다.'}</div>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // const discountRate = product.originalPrice && product.price
  //   ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  //   : 0;

  const totalPrice = (product.price ?? 0) * quantity;

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart({
        products_id: productId,
        quantity: quantity,
        name: product.name,
        brand: product.brand,
        price: product.price ?? 0,
        image: product.imageUrl || '',
      });
      alert(`${quantity}개를 장바구니에 추가했습니다.`);
    } catch (e) {
      console.error(e);
      alert("장바구니에 추가 실패");
    }
  };

  const handleBuyNow = () => {
    // 결제 페이지로 이동 (바로구매)
    router.push(`/checkout?type=buyNow&productId=${productId}&quantity=${quantity}`);
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



  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div>
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

        {/* 제품 이미지 - 첫 번째 이미지 */}
        <Container size="narrow">
          <div className="relative aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={imageUrls[0] || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/*{discountRate > 0 && (*/}
            {/*  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg">*/}
            {/*    <span className="text-lg">{discountRate}%</span>*/}
            {/*  </div>*/}
            {/*)}*/}
          </div>
        </Container>

        {/* 제품 기본 정보 */}
        <Container size="narrow">
          <div className="py-6 border-b border-gray-200">
          <div className="text-sm text-blue-600 mb-2">{product.brand}</div>
          <h1 className="text-xl text-gray-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-900">{reviewSummary?.reviewAvg ?? 0}</span>
            </div>
            <span className="text-gray-500">
              리뷰 {(reviewSummary?.reviewCount ?? 0).toLocaleString()}개
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
              {/*{product.price && (*/}
              {/*  <span className="text-gray-400 line-through">*/}
              {/*    {product.price.toLocaleString()}원*/}
              {/*  </span>*/}
              {/*)}*/}
              {/*{discountRate > 0 && (*/}
              {/*  <span className="text-red-500">{discountRate}%</span>*/}
              {/*)}*/}
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
            {/*<button*/}
            {/*  onClick={() => setSelectedTab('ingredients')}*/}
            {/*  className={`flex-1 px-4 py-3 border-b-2 transition-colors ${*/}
            {/*    selectedTab === 'ingredients'*/}
            {/*      ? 'border-blue-600 text-blue-600'*/}
            {/*      : 'border-transparent text-gray-600'*/}
            {/*  }`}*/}
            {/*>*/}
            {/*  원재료/성분*/}
            {/*</button>*/}
            <button
              onClick={() => setSelectedTab('reviews')}
              className={`flex-1 px-4 py-3 border-b-2 transition-colors ${
                selectedTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              리뷰 {reviewSummary?.reviewCount ?? 0}
            </button>
          </div>
          </Container>
        </div>

        {/* 탭 컨텐츠 */}
        <Container size="narrow">
          <div className="py-6 pb-40">
          {/* 상품정보 탭 */}
          {selectedTab === 'info' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg text-gray-900 mb-4">제품 상세</h2>
                  <div className="space-y-3">
                    <div className="flex py-2 border-b border-gray-100">
                      <div className="w-24 text-sm text-gray-500">용량</div>
                      <div className="flex-1 text-sm text-gray-900">{product.size}g</div>
                    </div>
                    <div className="flex py-2 border-b border-gray-100">
                      <div className="w-24 text-sm text-gray-500">원산지</div>
                      <div className="flex-1 text-sm text-gray-900">{product.madeIn}</div>
                    </div>
                    {/*<div className="flex py-2 border-b border-gray-100">*/}
                    {/*  <div className="w-24 text-sm text-gray-500">적합 연령</div>*/}
                    {/*  <div className="flex-1 text-sm text-gray-900">{product.ageGroup?.join(', ') ?? '-'}</div>*/}
                    {/*</div>*/}
                    <div className="flex py-2 border-b border-gray-100">
                      <div className="w-24 text-sm text-gray-500">브랜드</div>
                      <div className="flex-1 text-sm text-gray-900">{product.brand}</div>
                    </div>
                  </div>
                </div>

                {/* 추가 이미지 - 나머지 2개 */}
                {imageUrls.length > 1 && (
                  <div>
                    <h2 className="text-lg text-gray-900 mb-4">제품 이미지</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {imageUrls.slice(1, 3).map((imageUrl, index) => (
                        <div key={index} className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={imageUrl}
                            alt={`${product.name} - 이미지 ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                      {product.ingredients?.slice(0, 5).map((ingredient) => (
                          <div key={ingredient.ingredients_id}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-900">{ingredient.ingredients_name}</span>
                              <span className="text-sm text-gray-500">
                          {ingredient.ingredients_percentage}%
                        </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{width: `${ingredient.ingredients_percentage}%`}}
                              />
                            </div>
                          </div>
                      )) ?? <div className="text-sm text-gray-500">성분 정보 없음</div>}
                    </div>
                  </div>

                  {product.ingredients && product.ingredients.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="size-5 text-yellow-600 shrink-0 mt-0.5"/>
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

                <div>
                  <h2 className="text-lg text-gray-900 mb-4">효능</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {product.benefits?.map(benefit => (
                        <div
                            key={benefit.benefit_id}
                            className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                        >
                          <Check className="size-5 text-blue-600 shrink-0"/>
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
                                  style={{width: `${(5 - idx) * 15}%`}}
                              />
                            </div>
                          </div>
                      )) ?? <div className="text-sm text-gray-500">성분 정보 없음</div>}
                    </div>
                  </div>

                  {product.ingredients && product.ingredients.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="size-5 text-yellow-600 shrink-0 mt-0.5"/>
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
                  <div className="text-4xl text-blue-900 mb-2">{}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => {
                      const roundedScore = reviewSummary?.reviewAvg && reviewSummary.reviewAvg > 0
                          ? Math.round(reviewSummary.reviewAvg * 2) / 2
                          : 0;
                      const isFull = star <= Math.floor(roundedScore);
                      const isHalf = !isFull && star === Math.ceil(roundedScore) && roundedScore % 1 === 0.5;

                      if (isFull) {
                        return (
                            <Star
                                key={star}
                                className="size-4 fill-yellow-400 text-yellow-400"
                            />
                        );
                      } else if (isHalf) {
                        return (
                            <StarHalf
                                key={star}
                                className="size-4 fill-yellow-400 text-yellow-400"
                            />
                        );
                      } else {
                        return (
                            <Star
                                key={star}
                                className="size-4 text-gray-300"
                            />
                        );
                      }
                    })}
                  </div>
                  <div className="text-sm text-blue-700">
                    {reviewSummary?.reviewCount}개의 리뷰

                    {/*{reviewSummary?.reviewAvg}이거몇?*/}
                  </div>
                </div>
              </div>

              {/* 내 리뷰 섹션 */}
              {isAuthenticated && myReview ? (
                <div className="border-2 border-blue-200 rounded-lg p-4 mb-4 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{myReview.userName}</span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        내 리뷰
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`size-4 ${
                              star <= myReview.score
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{myReview.title}</p>
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    {myReview.content}
                  </button>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                    title="리뷰 수정"
                  >
                    <Pencil className="size-4" />
                  </button>
                </div>
              ) : isAuthenticated ? (
                // 구매 여부 확인 중
                checkingPurchase ? (
                  <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl text-center">
                    구매 여부 확인 중...
                  </div>
                ) : hasPurchased ? (
                  // 구매한 경우에만 리뷰 작성 버튼 표시
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="size-5" />
                    리뷰 작성하기
                  </button>
                ) : (
                  // 구매하지 않은 경우
                  <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl text-center">
                    이 상품을 구매한 고객만 리뷰를 작성할 수 있습니다.
                  </div>
                )
              ) : (
                // 로그인하지 않은 경우
                <div className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl text-center">
                  리뷰를 작성하려면 로그인이 필요합니다.
                </div>
              )}

              {/* 리뷰 목록 (내 리뷰 제외) */}
              <div className="space-y-4">
                {reviewLoading ? (
                  <div className="text-center py-8 text-gray-500">리뷰를 불러오는 중...</div>
                ) : reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">{review.userName}</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`size-4 ${
                                  star <= review.score
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{review.title}</p>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        {review.content}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {isAuthenticated && myReview 
                      ? '다른 리뷰가 없습니다.' 
                      : '아직 리뷰가 없습니다.'}
                  </div>
                )}
              </div>

              {/*<button className="w-full py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">*/}
              {/*  리뷰 더보기*/}
              {/*</button>*/}
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

        {/* 리뷰 작성/수정 폼 모달 */}
        {showReviewForm && product && (
          <ReviewForm
            productId={productId}
            productName={product.name}
            reviewId={myReview?.id}
            initialData={myReview ? {
              title: myReview.title,
              content: myReview.content,
              score: myReview.score,
            } : undefined}
            onClose={() => setShowReviewForm(false)}
            onSuccess={ async () => {
              // 리뷰 목록 새로고침
              setShowReviewForm(false);
              setReviewLoaded(false); // 리뷰 다시 불러오기 위해 리셋
              await fetchReviewSummary();
              await fetchReviews(); // 리뷰 탭이 아니어도 불러오기 (다음에 탭 클릭 시 표시)
            }}
          />
        )}
      </div>
    </div>
  );
}