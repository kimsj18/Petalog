'use client';

import React from 'react';
import { ProductCard } from '../product/ProductCard';
import { Product } from '../../types';

interface ProductGridProps {
  selectedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  filters: {
    priceRange: number[];
    ageGroup: string[];
    benefits: string[];
    brands: string[];
  };
}

export function ProductGrid({ selectedProducts, onSelectProduct, filters }: ProductGridProps) {
  // Filter products based on selected filters
  const filteredProducts = selectedProducts.filter(product => {
    // Price filter
    if (product.price && product.price > filters.priceRange[1]) return false;

    // Age group filter
    if (filters.ageGroup.length > 0) {
      const hasMatchingAge = product.ageGroup?.some(age => filters.ageGroup.includes(age));
      if (!hasMatchingAge) return false;
    }

    // Benefits filter
    if (filters.benefits.length > 0) {
      const hasMatchingBenefit = product.benefits?.some(benefit => filters.benefits.includes(benefit.benefit_name));
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
            key={product.products_id}
            product={product}
            isSelected={selectedProducts.some(p => p.products_id === product.products_id)}
            onSelect={() => onSelectProduct(product)}
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
