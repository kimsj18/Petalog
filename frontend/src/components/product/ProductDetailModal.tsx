'use client';

import React from 'react';
import { X, Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const discountRate = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">제품 상세정보</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-6 text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountRate > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg">
                  {discountRate}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="text-blue-600 mb-2">{product.brand}</div>
              <h3 className="text-gray-900 mb-4">{product.name}</h3>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="size-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-900">{product.rating}</span>
                </div>
                <span className="text-gray-500">
                  리뷰 {product.reviewCount.toLocaleString()}개
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                {product.originalPrice && (
                  <span className="text-gray-400 line-through">
                    {product.originalPrice.toLocaleString()}원
                  </span>
                )}
                <span className="text-gray-900">
                  {product.price.toLocaleString()}원
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 flex-shrink-0">용량</span>
                  <span className="text-gray-900">{product.size}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 flex-shrink-0">원산지</span>
                  <span className="text-gray-900">{product.madeIn}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 flex-shrink-0">적합연령</span>
                  <span className="text-gray-900">{product.ageGroup.join(', ')}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-24 flex-shrink-0">추천크기</span>
                  <span className="text-gray-900">{product.bestFor.join(', ')}</span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-900 mb-3">효능</h4>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map(benefit => (
                    <span
                      key={benefit}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-900 mb-3">주요 성분</h4>
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="size-5" />
                  구매하기
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="size-5 text-gray-700" />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="size-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-gray-900 mb-6">리뷰</h3>
            <div className="space-y-4">
              {[
                { author: '김**', rating: 5, date: '2024.12.10', content: '우리 강아지가 너무 좋아해요! 소화도 잘 되는 것 같고 털도 더 윤기나는 것 같아요.' },
                { author: '이**', rating: 5, date: '2024.12.08', content: '재구매 3번째입니다. 알레르기 반응도 없고 좋아요.' },
                { author: '박**', rating: 4, date: '2024.12.05', content: '가격은 조금 있지만 품질이 좋은 것 같습니다. 추천합니다!' },
              ].map((review, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-900">{review.author}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}