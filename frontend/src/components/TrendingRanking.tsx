'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../types';
import { Container } from './common/Container';
import { apiClient } from '@/lib/api';

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

interface TrendingRankingProps {
  onProductClick?: (product: Product) => void;
}

// API 응답 타입 정의
interface IngredientDTO {
  name: string;
  percentage: number;
}

interface BenefitDTO {
  name: string;
}

interface ProductDetailDTO {
  productsId: string;
  name: string;
  brand: string;
  category: string;
  snackType: string;
  imageUrl: string;
  madeIn: string;
  size: number;
  price: number;
  quantity: number;
  description: string;
  ingredientDTOs: IngredientDTO[];
  benefitDTOs: BenefitDTO[];
}

export function TrendingRanking({ onProductClick }: TrendingRankingProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [apiProducts, setApiProducts] = useState<ProductDetailDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const categories = [
    { id: 'all', name: '카테고리 전체' },
    { id: 'treat', name: '트릿/큐브' },
    { id: 'jerky', name: '육포/저키' },
    { id: 'churu', name: '츄르/액상' },
    { id: 'dental', name: '덴탈껌' },
    { id: 'cookie', name: '쿠키' },
  ];

  // 카테고리별 랭킹 데이터 가져오기
  useEffect(() => {
    const fetchCategoryRanking = async () => {
      // 'all' 카테고리는 API 호출하지 않음 (mock 데이터 사용)
      if (selectedCategory === 'all') {
        setApiProducts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get<ProductDetailDTO[]>(
          '/v1/user/categoryList',
          { category: selectedCategory }
        );

        if (response.success && response.data) {
          setApiProducts(response.data);
        } else {
          setError(response.error || '데이터를 불러오는데 실패했습니다.');
          setApiProducts([]);
        }
      } catch (err) {
        console.error('카테고리별 랭킹 조회 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setApiProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryRanking();
  }, [selectedCategory]);

  // 급상승 1위 제품
  const topTrendingProduct = {
    rank: 3,
    change: '+2',
    brand: '라비엘르',
    name: '엔자임 오트 스크럽 파우더 워시',
    rating: 4.49,
    reviewCount: 569,
    image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  };

  // 카테고리별 랭킹 제품들
  const categoryProducts = {
    all: [
      {
        rank: 1,
        change: '+1',
        brand: '도리드',
        name: '다이얼리 저분자 히알루론산 세럼',
        rating: 4.60,
        reviewCount: 72137,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 2,
        change: '0',
        brand: '웰리쥬',
        name: '리얼 히알루로닉 블루 100 앰플',
        rating: 4.63,
        reviewCount: 25717,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 3,
        change: '0',
        brand: '에스트라',
        name: '아토베리어365 크림',
        rating: 4.67,
        reviewCount: 12413,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 4,
        change: '+1',
        brand: '아누아',
        name: 'PDRN 히알루론산 세럼',
        rating: 4.61,
        reviewCount: 8800,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 5,
        change: '+1',
        name: '녹두 약산성 클렌저',
        brand: '비플레인',
        rating: 4.62,
        reviewCount: 43726,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 6,
        change: '0',
        brand: '린제이',
        name: '모델링 마스크 리',
        rating: 4.74,
        reviewCount: 20936,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
    treat: [
      {
        rank: 1,
        change: '0',
        brand: '네츄럴코어',
        name: '프리미엄 닭가슴살 큐브',
        rating: 4.8,
        reviewCount: 1234,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 2,
        change: '+1',
        brand: '오리젠',
        name: '오리지널 독 트릿',
        rating: 4.9,
        reviewCount: 856,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 3,
        change: '-1',
        brand: '그리니스',
        name: '치즈 트릿',
        rating: 4.6,
        reviewCount: 542,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
    jerky: [
      {
        rank: 1,
        change: '+2',
        brand: '더리얼',
        name: '오리고기 육포',
        rating: 4.8,
        reviewCount: 734,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 2,
        change: '0',
        brand: '캐나다 프레시',
        name: '연어 스틱 저키',
        rating: 4.7,
        reviewCount: 623,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 3,
        change: '-1',
        brand: '더리얼',
        name: '소고기 육포',
        rating: 4.8,
        reviewCount: 891,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
    churu: [
      {
        rank: 1,
        change: '0',
        brand: '리얼미트',
        name: '닭가슴살 츄르',
        rating: 4.7,
        reviewCount: 456,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 2,
        change: '+1',
        brand: '캐나다 프레시',
        name: '연어 크림 스낵',
        rating: 4.8,
        reviewCount: 389,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
    dental: [
      {
        rank: 1,
        change: '+1',
        brand: '그리니스',
        name: '치즈 덴탈껌',
        rating: 4.5,
        reviewCount: 678,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
      {
        rank: 2,
        change: '-1',
        brand: '네츄럴코어',
        name: '프리미엄 덴탈 스틱',
        rating: 4.8,
        reviewCount: 445,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      },
    ],
  };

  // 선택된 카테고리에 따라 표시할 제품 결정
  type DisplayProduct = {
    rank: number;
    change: string;
    brand: string;
    name: string;
    rating: number;
    reviewCount: number;
    image: string;
    productData?: ProductDetailDTO; // API 응답 데이터인 경우
  };

  const currentProducts: DisplayProduct[] = selectedCategory === 'all' 
    ? categoryProducts.all.map(item => ({
        rank: item.rank,
        change: item.change,
        brand: item.brand,
        name: item.name,
        rating: item.rating,
        reviewCount: item.reviewCount,
        image: item.image,
      }))
    : apiProducts.length > 0 
      ? apiProducts.map((product, index) => {
          // imageUrl이 쉼표로 구분된 여러 이미지일 수 있으므로 첫 번째 이미지만 사용
          const firstImageUrl = product.imageUrl 
            ? product.imageUrl.split(',')[0].trim() 
            : '';
          
          // 상대 경로를 전체 URL로 변환
          const fullImageUrl = getImageUrl(firstImageUrl);
          
          return {
            rank: index + 1,
            change: '0', // API 응답에 순위 변동 정보가 없으면 기본값
            brand: product.brand,
            name: product.name,
            rating: 0, // API 응답에 rating이 없으면 기본값
            reviewCount: 0, // API 응답에 reviewCount가 없으면 기본값
            image: fullImageUrl,
            productData: product, // 원본 데이터 보관
          };
        })
      : [];
  
  const currentCategoryName = categories.find(c => c.id === selectedCategory)?.name || '카테고리 전체';

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500';
    if (rank === 2) return 'bg-gray-400';
    if (rank === 3) return 'bg-amber-600';
    return 'bg-gray-300';
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-red-500';
    if (change.startsWith('-')) return 'text-blue-500';
    return 'text-gray-400';
  };

  // 제품 객체를 Product 타입으로 변환
  const convertToProduct = (item: DisplayProduct, id: string): Product => {
    // API 응답 데이터인 경우
    if (item.productData) {
      const product = item.productData;
      // imageUrl이 쉼표로 구분된 여러 이미지일 수 있으므로 첫 번째 이미지만 사용
      const firstImageUrl = product.imageUrl 
        ? product.imageUrl.split(',')[0].trim() 
        : '';
      
      // 상대 경로를 전체 URL로 변환
      const fullImageUrl = getImageUrl(firstImageUrl);
      
      return {
        products_id: product.productsId,
        name: product.name,
        brand: product.brand,
        category: product.category,
        snack_type: product.snackType,
        imageUrl: fullImageUrl,
        quantity: product.quantity,
        price: product.price,
        rating: item.rating || 0,
        reviewCount: item.reviewCount || 0,
        ingredients: product.ingredientDTOs.map(ing => ({
          ingredients_id: '',
          products_id: product.productsId,
          ingredients_name: ing.name,
        })),
        benefits: product.benefitDTOs.map(ben => ({
          benefit_id: '',
          products_id: product.productsId,
          benefit_name: ben.name,
        })),
        size: `${product.size}g`,
        madeIn: product.madeIn,
        ageGroup: ['전연령'],
      };
    }
    
    // Mock 데이터인 경우
    return {
      products_id: id,
      name: item.name,
      brand: item.brand,
      category: selectedCategory === 'all' ? 'all' : selectedCategory,
      snack_type: '',
      imageUrl: item.image,
      quantity: 0,
      price: 15000,
      rating: item.rating,
      reviewCount: item.reviewCount,
      ingredients: [],
      benefits: [],
      size: '200g',
      madeIn: '대한민국',
      ageGroup: ['전연령'],
    };
  };

  return (
    <Container>
      <div className="py-6">
      {/* 급상승 랭킹 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">12월 17일 수요일</div>
            <h2 className="text-gray-900">
              <span className="text-cyan-500">급상승</span> 랭킹
            </h2>
          </div>
          <ChevronRight className="size-5 text-gray-400" />
        </div>

        {/* 대표 제품 */}
        <div 
          onClick={() => onProductClick && onProductClick(convertToProduct(topTrendingProduct, 'trending-top'))}
          className="bg-white rounded-lg border border-gray-200 p-4 relative cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="absolute top-4 left-4 z-10">
            <div className={`${getRankBadgeColor(topTrendingProduct.rank)} text-white size-10 rounded-full flex items-center justify-center`}>
              {topTrendingProduct.rank}
            </div>
            <div className="text-center mt-1 text-xs text-red-500">
              {topTrendingProduct.change}
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-32 h-32 shrink-0">
              <ImageWithFallback
                src={topTrendingProduct.image}
                alt={topTrendingProduct.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-500 mb-1">{topTrendingProduct.brand}</div>
              <h3 className="text-gray-900 mb-2 line-clamp-2">{topTrendingProduct.name}</h3>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-orange-500">★</span>
                <span>{topTrendingProduct.rating}</span>
                <span className="text-gray-400">({topTrendingProduct.reviewCount.toLocaleString()})</span>
              </div>
              <div className="mt-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded inline-block">
                3/10
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리별 선택한 랭킹 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-gray-500 text-sm mb-1">화해 고객들이 직접 <span className="text-cyan-500">선택한 랭킹</span></div>
          </div>
          <ChevronRight className="size-5 text-gray-400" />
        </div>

        {/* 카테고리 드롭다운 */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            {currentCategoryName}
            <ChevronDown className="size-4" />
          </button>
          
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowCategoryDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 로딩 및 에러 상태 */}
        {loading && (
          <div className="text-center py-8 text-gray-500">로딩 중...</div>
        )}
        
        {error && (
          <div className="text-center py-8 text-red-500">{error}</div>
        )}

        {/* 제품 리스트 */}
        {!loading && !error && (
          <div className="space-y-3">
            {currentProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {selectedCategory === 'all' 
                  ? '카테고리를 선택해주세요.' 
                  : '해당 카테고리의 제품이 없습니다.'}
              </div>
            ) : (
              currentProducts.map((product, index) => (
                <div 
                  key={product.productData ? product.productData.productsId : `mock-${index}`} 
                  onClick={() => onProductClick && onProductClick(convertToProduct(product, product.productData ? product.productData.productsId : `trending-${selectedCategory}-${index}`))}
                  className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="shrink-0 relative">
                    <div className={`${getRankBadgeColor(product.rank)} text-white size-8 rounded-full flex items-center justify-center text-sm`}>
                      {product.rank}
                    </div>
                    {product.change !== '0' && (
                      <div className={`text-center mt-0.5 text-xs ${getChangeColor(product.change)}`}>
                        {product.change}
                      </div>
                    )}
                  </div>

                  <div className="w-16 h-16 shrink-0">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500">{product.brand}</div>
                    <h4 className="text-sm text-gray-900 line-clamp-1 mb-1">{product.name}</h4>
                    {product.productData ? (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{product.productData.price.toLocaleString()}원</span>
                        {product.productData.size && <span>· {product.productData.size}g</span>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-orange-500">★</span>
                        <span>{product.rating}</span>
                        <span className="text-gray-400">({product.reviewCount.toLocaleString()})</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 카테고리 전체보기 버튼 */}
        <button className="w-full mt-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
          카테고리 전체보기
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
    </Container>
  );
}