'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { Search } from '@/components/common/Search';
import { apiClient } from '@/lib/api';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useRouter } from 'next/navigation';

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

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<ProductDetailDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 검색 실행
  const performSearch = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await apiClient.get<ProductDetailDTO[]>(
        '/v1/user/productList/search',
        { keyword: keyword.trim() }
      );

      if (response.success && response.data) {
        setSearchResults(response.data);
      } else {
        console.error("검색 실패:", response.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("검색 중 오류:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // URL 쿼리 파라미터 변경 시 검색 실행
  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setSearchResults([]);
    }
  }, [query, performSearch]);

  const handleProductClick = (product: ProductDetailDTO, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.productsId}`);
  };

  // 여백 클릭 시 홈으로 이동
  const handleBackgroundClick = () => {
    router.push('/');
  };

  // 콘텐츠 영역 클릭 시 이벤트 전파 방지
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="min-h-screen bg-white"
      onClick={handleBackgroundClick}
    >
      <div 
        className="max-w-6xl mx-auto px-4 pt-4"
        onClick={handleContentClick}
      >
        <Search />
      </div>

      <main 
        className="max-w-6xl mx-auto px-4 py-8"
        onClick={handleContentClick}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            검색 결과
          </h1>
          {query && (
            <p className="text-gray-600 text-sm">
              &quot;{query}&quot; 검색 결과
            </p>
          )}
        </div>

        {/* 검색 결과 영역 */}
        {isSearching ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-4"></div>
            <p className="text-gray-600">검색 중...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((product) => {
              // imageUrl이 쉼표로 구분된 여러 이미지일 수 있으므로 첫 번째 이미지만 사용
              const firstImageUrl = product.imageUrl 
                ? product.imageUrl.split(',')[0].trim() 
                : '';
              
              // 상대 경로를 전체 URL로 변환
              const fullImageUrl = getImageUrl(firstImageUrl);
              
              // 첫 번째 원재료를 주원료로 표시
              const mainIngredient = product.ingredientDTOs.length > 0 
                ? `${product.ingredientDTOs[0].name} ${product.ingredientDTOs[0].percentage}%`
                : '';

              return (
                <div 
                  key={product.productsId} 
                  onClick={(e) => handleProductClick(product, e)}
                  className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 shrink-0">
                    <ImageWithFallback
                      src={fullImageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                    <h4 className="text-sm text-gray-900 line-clamp-1 mb-1">{product.name}</h4>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                      <span>{product.price.toLocaleString()}원</span>
                      {product.size && <><span>·</span><span>{product.size}g</span></>}
                    </div>

                    {mainIngredient && (
                      <div className="flex items-center gap-1 text-xs mb-1">
                        <span className="text-gray-400">주원료: {mainIngredient}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {product.benefitDTOs.map((benefit, idx) => (
                        <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                          {benefit.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">
              &quot;{query}&quot;에 대한 검색 결과를 찾을 수 없습니다.
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색어를 입력해주세요
            </h3>
            <p className="text-gray-600">
              간식 이름이나 브랜드를 검색해보세요
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

