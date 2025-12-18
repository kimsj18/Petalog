'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { Product } from '../../types';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  const router = useRouter();

  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    router.push(`/products/${product.products_id}`);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    onSelect();
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${
        isSelected ? 'border-blue-600' : 'border-gray-200'
      }`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {discountRate > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded">
            {discountRate}%
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-sm text-blue-600 mb-1">{product.brand}</div>
        <h3 className="text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-900">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.benefits.slice(0, 2).map(benefit => (
            <span
              key={benefit}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
            >
              {benefit}
            </span>
          ))}
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.originalPrice.toLocaleString()}원
            </span>
          )}
          <span className="text-gray-900">
            {product.price.toLocaleString()}원
          </span>
        </div>

        <button
          onClick={handleSelectClick}
          className={`w-full py-2 rounded-lg transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isSelected ? '선택됨' : '비교하기'}
        </button>
      </div>
    </div>
  );
}