'use client';

import React from 'react';
import { X, Star, ShoppingCart, Check, Minus } from 'lucide-react';
import { Product } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ComparisonModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export function ComparisonModal({ products, isOpen, onClose }: ComparisonModalProps) {
  // 모달이 열려있지 않거나 제품이 없으면 렌더링하지 않음
  if (!isOpen || products.length === 0) {
    return null;
  }

  const comparisonCategories: Array<{
    key: 'price' | 'rating' | 'reviewCount' | 'size' | 'madeIn';
    label: string;
    format: (val: number | string) => string;
  }> = [
    { key: 'price', label: '가격', format: (val: number | string) => `${(val as number).toLocaleString()}원` },
    { key: 'rating', label: '평점', format: (val: number | string) => `${val}/5.0` },
    { key: 'reviewCount', label: '리뷰 수', format: (val: number | string) => `${(val as number).toLocaleString()}개` },
    { key: 'size', label: '용량', format: (val: number | string) => val as string },
    { key: 'madeIn', label: '원산지', format: (val: number | string) => val as string },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-gray-900">제품 비교</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-6 text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            {/* Header Row - Product Images and Names */}
            <div className="text-gray-900">제품</div>
            {products.map(product => (
              <div key={product.products_id} className="space-y-3">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm text-blue-600 mb-1">{product.brand}</div>
                  <h4 className="text-gray-900 line-clamp-2">{product.name}</h4>
                </div>
              </div>
            ))}

            {/* Basic Info Comparisons */}
            {comparisonCategories.map(category => (
              <React.Fragment key={category.key}>
                <div className="bg-gray-50 p-4 rounded-lg flex items-center text-gray-700">
                  {category.label}
                </div>
                {products.map(product => {
                  const value = product[category.key as keyof Product];
                  const price = product.price ?? 0;
                  const rating = product.rating ?? 0;
                  const reviewCount = product.reviewCount ?? 0;
                  
                  const isLowest = category.key === 'price' && 
                    Math.min(...products.map(p => p.price ?? 0)) === price;
                  const isHighest = (category.key === 'rating' && 
                    Math.max(...products.map(p => p.rating ?? 0)) === rating) ||
                    (category.key === 'reviewCount' &&
                    Math.max(...products.map(p => p.reviewCount ?? 0)) === reviewCount);
                  
                  let displayValue = '-';
                  if (value !== undefined && value !== null) {
                    displayValue = category.format(value as number | string);
                  }
                  
                  return (
                    <div
                      key={product.products_id}
                      className={`p-4 rounded-lg flex items-center ${
                        isLowest || isHighest ? 'bg-blue-50 border-2 border-blue-600' : 'bg-gray-50'
                      }`}
                    >
                      <span className={isLowest || isHighest ? 'text-blue-600' : 'text-gray-900'}>
                        {displayValue}
                      </span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Age Group */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center text-gray-700">
              적합 연령
            </div>
            {products.map(product => (
              <div key={product.products_id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-wrap gap-1">
                  {product.ageGroup?.map(age => (
                    <span
                      key={age}
                      className="text-xs bg-white px-2 py-1 rounded border border-gray-200"
                    >
                      {age}
                    </span>
                  )) ?? <span className="text-sm text-gray-500">-</span>}
                </div>
              </div>
            ))}

            {/* Benefits */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center text-gray-700">
              효능
            </div>
            {products.map(product => (
              <div key={product.products_id} className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {product.benefits?.map(benefit => (
                    <div key={benefit.benefit_id} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="size-4 text-green-600 shrink-0" />
                      <span>{benefit.benefit_name}</span>
                    </div>
                  )) ?? <span className="text-sm text-gray-500">-</span>}
                </div>
              </div>
            ))}

            {/* Ingredients */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center text-gray-700">
              주요 성분
            </div>
            {products.map(product => (
              <div key={product.products_id} className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  {product.ingredients?.slice(0, 3).map((ingredient) => (
                    <div key={ingredient.ingredients_id} className="text-sm text-gray-700">
                      • {ingredient.ingredients_name}
                    </div>
                  )) ?? <span className="text-sm text-gray-500">-</span>}
                  {product.ingredients && product.ingredients.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{product.ingredients.length - 3}개 더보기
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Size */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center text-gray-700">
              추천 크기
            </div>
            {products.map(product => (
              <div key={product.products_id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-wrap gap-1">
                  {product.size ? (
                    <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                      {product.size}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div></div>
            {products.map(product => (
              <div key={product.products_id} className="space-y-2">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="size-5" />
                  구매하기
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  상세보기
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}