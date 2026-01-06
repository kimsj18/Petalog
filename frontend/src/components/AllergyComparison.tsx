'use client';

import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { Container } from './common/Container';
import { apiClient } from '@/lib/api';

interface AllergyComparisonProps {
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
    const backendUrl = typeof window !== 'undefined' 
      ? (window.location.hostname === 'localhost' 
          ? 'http://localhost:8080' 
          : `${window.location.protocol}//${window.location.hostname}:8080`)
      : 'http://localhost:8080';
    return `${backendUrl}${imageUrl}`;
  }
  
  return imageUrl;
};

export function AllergyComparison({ onProductClick }: AllergyComparisonProps) {
  const [selectedMeat, setSelectedMeat] = useState('chicken');
  const [showMeatDropdown, setShowMeatDropdown] = useState(false);
  const [apiProducts, setApiProducts] = useState<ProductDetailDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meatTypes = [
    { id: 'chicken', name: '닭', icon: '🐔', color: 'yellow' },
    { id: 'beef', name: '소', icon: '🐄', color: 'red' },
    { id: 'pork', name: '돼지', icon: '🐷', color: 'pink' },
    { id: 'duck', name: '오리', icon: '🦆', color: 'blue' },
    { id: 'salmon', name: '연어', icon: '🐟', color: 'orange' },
    { id: 'lamb', name: '양', icon: '🐑', color: 'gray' },
    { id: 'sweetpotato', name: '고구마', icon: '🍠', color: 'orange' },
  ];

  // meatTypes id를 ingredient 이름으로 매핑
  const ingredientMap: { [key: string]: string } = {
    chicken: '닭',
    beef: '소고기',
    pork: '돼지',
    duck: '오리',
    salmon: '연어',
    lamb: '양',
    sweetpotato: '고구마',
  };

  // 원재료별 제품 데이터 가져오기
  useEffect(() => {
    const fetchProductsByIngredient = async () => {
      const ingredient = ingredientMap[selectedMeat];
      if (!ingredient) {
        setApiProducts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.get<ProductDetailDTO[]>(
          '/v1/user/productList/ingredient',
          { ingredient }
        );

        if (response.success && response.data) {
          setApiProducts(response.data);
        } else {
          setError(response.error || '데이터를 불러오는데 실패했습니다.');
          setApiProducts([]);
        }
      } catch (err) {
        console.error('원재료별 제품 조회 실패:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setApiProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByIngredient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMeat]);

  const currentMeat = meatTypes.find(m => m.id === selectedMeat);

  // API 응답을 Product 타입으로 변환
  const convertToProduct = (product: ProductDetailDTO): Product => {
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
      rating: 0, // API 응답에 rating이 없으면 기본값
      reviewCount: 0, // API 응답에 reviewCount가 없으면 기본값
      ingredients: product.ingredientDTOs.map((ing, idx) => ({
        ingredients_id: `${product.productsId}-ing-${idx}`,
        products_id: product.productsId,
        ingredients_name: ing.name,
        ingredients_percentage: ing.percentage,
      })),
      benefits: product.benefitDTOs.map((ben, idx) => ({
        benefit_id: `${product.productsId}-ben-${idx}`,
        products_id: product.productsId,
        benefit_name: ben.name,
      })),
      size: `${product.size}g`,
      madeIn: product.madeIn,
      ageGroup: ['전연령'],
    };
  };

  return (
    <div className="bg-gray-50 py-8">
      <Container>
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">알러지 비교</h2>
          <p className="text-gray-600 text-sm">원재료별로 간식을 비교하고 우리 강아지에게 맞는 제품을 찾아보세요</p>
        </div>

        {/* Meat Type Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowMeatDropdown(!showMeatDropdown)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <span>{currentMeat?.icon} {currentMeat?.name} 기반 간식</span>
            <ChevronDown className="size-4" />
          </button>
          
          {showMeatDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48">
              {meatTypes.map(meat => (
                <button
                  key={meat.id}
                  onClick={() => {
                    setSelectedMeat(meat.id);
                    setShowMeatDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <span>{meat.icon}</span>
                  <span>{meat.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Comparison */}
        <div className="bg-white rounded-xl p-4">
          {/* 로딩 및 에러 상태 */}
          {loading && (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          )}
          
          {error && (
            <div className="text-center py-8 text-red-500">{error}</div>
          )}

          {/* 제품 리스트 */}
          {!loading && !error && (
            <div className="space-y-3 mb-4">
              {apiProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  해당 원재료의 제품이 없습니다.
                </div>
              ) : (
                apiProducts.map((product) => {
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
                      onClick={() => onProductClick && onProductClick(convertToProduct(product))}
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
                })
              )}
            </div>
          )}

          {/* Allergy Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="text-yellow-900 mb-1">알러지 체크 방법</div>
                <p className="text-yellow-800">
                  새로운 단백질 원료를 처음 급여할 때는 소량으로 시작하여 2-3일간 반응을 관찰하세요. 
                  피부 발진, 설사, 구토 등의 증상이 나타나면 즉시 중단하고 수의사와 상담하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
