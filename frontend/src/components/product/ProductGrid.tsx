'use client';

import React from 'react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../App';

interface ProductGridProps {
  selectedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onViewProductDetail?: (product: Product) => void;
  filters: {
    priceRange: number[];
    ageGroup: string[];
    benefits: string[];
    brands: string[];
  };
}

export function ProductGrid({ selectedProducts, onSelectProduct, onViewProductDetail, filters }: ProductGridProps) {
  // Mock product data
  const allProducts: Product[] = [
    {
      id: '1',
      name: '프리미엄 닭가슴살 큐브',
      brand: '네츄럴코어',
      price: 18900,
      originalPrice: 25000,
      rating: 4.8,
      reviewCount: 1234,
      image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: ['닭가슴살 95%', '글리세린', '천연향료'],
      benefits: ['치아 건강', '소화 개선'],
      ageGroup: ['전연령'],
      size: '200g',
      madeIn: '대한민국',
      bestFor: ['소형견', '중형견'],
    },
    {
      id: '2',
      name: '오리지��� 독 릿',
      brand: '오리젠',
      price: 32000,
      rating: 4.9,
      reviewCount: 856,
      image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: ['신선한 닭고기', '칠면조', '연어', '청어'],
      benefits: ['피부/모질 개선', '면역력 강화'],
      ageGroup: ['어덜트 (1-7살)', '시니어 (7살 이상)'],
      size: '92g',
      madeIn: '캐나다',
      bestFor: ['전체크기'],
    },
    {
      id: '3',
      name: '연어 스틱 저키',
      brand: '캐나다 프레시',
      price: 24500,
      originalPrice: 28000,
      rating: 4.7,
      reviewCount: 623,
      image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: ['연어 90%', '고구마', '크랜베리'],
      benefits: ['피부/모질 개선', '소화 개선'],
      ageGroup: ['전연령'],
      size: '100g',
      madeIn: '캐나다',
      bestFor: ['소형견', '중형견', '대형견'],
    },
    {
      id: '4',
      name: '관절 케어 츄르',
      brand: '리얼미트',
      price: 15800,
      rating: 4.6,
      reviewCount: 945,
      image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: ['소고기', '글루코사민', '콘드로이틴', '초록입홍합'],
      benefits: ['관절 건강', '면역력 강화'],
      ageGroup: ['어덜트 (1-7살)', '시니어 (7살 이상)'],
      size: '120g (15g x 8개)',
      madeIn: '대한민국',
      bestFor: ['중형견', '대형견'],
    },
    {
      id: '5',
      name: '치즈 덴탈껌',
      brand: '그리니스',
      price: 12900,
      originalPrice: 16000,
      rating: 4.5,
      reviewCount: 1567,
      image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: ['우유단백', '치즈파우더', '식이섬유', '민트추출물'],
      benefits: ['치아 건강', '소화 개선'],
      ageGroup: ['퍼피 (1살 미만)', '어덜트 (1-7살)'],
      size: '300g',
      madeIn: '대한민국',
      bestFor: ['소형견'],
    },
    {
      id: '6',
      name: '오리고기 육포',
      brand: '더리얼',
      price: 21000,
      rating: 4.8,
      reviewCount: 734,
      image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: ['오리고기 100%'],
      benefits: ['피부/모질 개선', '체중 관리'],
      ageGroup: ['전연령'],
      size: '150g',
      madeIn: '대한민국',
      bestFor: ['중형견', '대형견'],
    },
    {
      id: '7',
      name: '저알러지 사슴고기',
      brand: '네츄럴코어',
      price: 28500,
      rating: 4.9,
      reviewCount: 412,
      image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: ['사슴고기 100%'],
      benefits: ['피부/모질 개선', '소화 개선'],
      ageGroup: ['전연령'],
      size: '80g',
      madeIn: '뉴질랜드',
      bestFor: ['알러지견', '소형견', '중형견'],
    },
    {
      id: '8',
      name: '퍼피 트레이닝 바이츠',
      brand: '리얼미트',
      price: 9900,
      rating: 4.4,
      reviewCount: 2103,
      image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: ['닭고기', '고구마', '당근', 'DHA'],
      benefits: ['소화 개선', '면역력 강화'],
      ageGroup: ['퍼피 (1살 미만)'],
      size: '200g',
      madeIn: '대한민국',
      bestFor: ['소형견'],
    },
  ];

  // Filter products based on selected filters
  const filteredProducts = allProducts.filter(product => {
    // Price filter
    if (product.price > filters.priceRange[1]) return false;

    // Age group filter
    if (filters.ageGroup.length > 0) {
      const hasMatchingAge = product.ageGroup.some(age => filters.ageGroup.includes(age));
      if (!hasMatchingAge) return false;
    }

    // Benefits filter
    if (filters.benefits.length > 0) {
      const hasMatchingBenefit = product.benefits.some(benefit => filters.benefits.includes(benefit));
      if (!hasMatchingBenefit) return false;
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 mb-1">전체 간식</h2>
          <p className="text-gray-600">총 {filteredProducts.length}개의 제품</p>
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>인기순</option>
          <option>최신순</option>
          <option>낮은 가격순</option>
          <option>높은 가격순</option>
          <option>리뷰 많은순</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProducts.some(p => p.id === product.id)}
            onSelect={() => onSelectProduct(product)}
            onViewDetail={onViewProductDetail ? () => onViewProductDetail(product) : undefined}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">필터를 조정해보세요.</p>
        </div>
      )}
    </div>
  );
}