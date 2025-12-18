'use client';

import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { Container } from './common/Container';

interface AllergyComparisonProps {
  onProductClick?: (product: Product) => void;
}

export function AllergyComparison({ onProductClick }: AllergyComparisonProps) {
  const [selectedMeat, setSelectedMeat] = useState('chicken');

  const meatTypes = [
    { id: 'chicken', name: '닭', icon: '🐔', color: 'yellow' },
    { id: 'beef', name: '소', icon: '🐄', color: 'red' },
    { id: 'pork', name: '돼지', icon: '🐷', color: 'pink' },
    { id: 'duck', name: '오리', icon: '🦆', color: 'blue' },
    { id: 'salmon', name: '연어', icon: '🐟', color: 'orange' },
    { id: 'lamb', name: '양', icon: '🐑', color: 'gray' },
  ];

  const products: { [key: string]: Product[] } = {
    chicken: [
      {
        name: '프리미엄 닭가슴살 큐브',
        brand: '네츄럴코어',
        price: 18900,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '닭가슴살 95%',
        rating: 4.8,
        allergyRisk: '낮음',
        benefits: ['고단백', '저지방'],
      },
      {
        name: '오리지널 독 트릿',
        brand: '오리젠',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '신선한 닭고기 + 칠면조',
        rating: 4.9,
        allergyRisk: '중간',
        benefits: ['복합 단백질', '오메가-3'],
      },
      {
        name: '닭가슴살 동결건조',
        brand: '리얼미트',
        price: 15800,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '국내산 닭가슴살 100%',
        rating: 4.7,
        allergyRisk: '낮음',
        benefits: ['단일 단백질', '무첨가'],
      },
    ],
    beef: [
      {
        name: '소고기 육포',
        brand: '더리얼',
        price: 23000,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '소고기 100%',
        rating: 4.8,
        allergyRisk: '낮음',
        benefits: ['철분 풍부', '근육 발달'],
      },
      {
        name: '프리미엄 소고기 큐브',
        brand: '네츄럴코어',
        price: 21500,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '소고기 90%',
        rating: 4.6,
        allergyRisk: '낮음',
        benefits: ['고단백', '맛좋음'],
      },
    ],
    pork: [
      {
        name: '돼지고기 저키',
        brand: '리얼미트',
        price: 16900,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '돼지고기 100%',
        rating: 4.5,
        allergyRisk: '중간',
        benefits: ['���타민 B', '에너지'],
      },
      {
        name: '저지방 돼지고기',
        brand: '그리니스',
        price: 14500,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '저지방 돼지고기 95%',
        rating: 4.4,
        allergyRisk: '낮음',
        benefits: ['저지방', '소화 잘됨'],
      },
    ],
    duck: [
      {
        name: '오리고기 육포',
        brand: '더리얼',
        price: 21000,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '오리고기 100%',
        rating: 4.8,
        allergyRisk: '낮음',
        benefits: ['저알러지', '피부/모질'],
      },
      {
        name: '오리고기 트릿',
        brand: '캐나다 프레시',
        price: 19800,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '오리고기 98%',
        rating: 4.7,
        allergyRisk: '낮음',
        benefits: ['불포화지방', '영양 풍부'],
      },
    ],
    salmon: [
      {
        name: '연어 스틱 저키',
        brand: '캐나다 프레시',
        price: 24500,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '연어 90%',
        rating: 4.7,
        allergyRisk: '낮음',
        benefits: ['오메가-3', '피부/모질'],
      },
      {
        name: '연어 큐브',
        brand: '네츄럴코어',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '연어 95%',
        rating: 4.9,
        allergyRisk: '낮음',
        benefits: ['DHA', '두뇌 발달'],
      },
    ],
    lamb: [
      {
        name: '양고기 육포',
        brand: '더리얼',
        price: 26500,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '양고기 100%',
        rating: 4.8,
        allergyRisk: '매우 낮음',
        benefits: ['저알러지', '희귀 단백질'],
      },
      {
        name: '저알러지 사슴고기',
        brand: '네츄럴코어',
        price: 28500,
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        mainIngredient: '사슴고기 100%',
        rating: 4.9,
        allergyRisk: '매우 낮음',
        benefits: ['초저알러지', '민감한 위장'],
      },
    ],
  };

  const currentProducts = products[selectedMeat as keyof typeof products] || [];
  const currentMeat = meatTypes.find(m => m.id === selectedMeat);

  // 알러지 제품을 Product 타입으로 변환
  const convertToProduct = (item: any, id: string): Product => ({
    id,
    name: item.name,
    brand: item.brand,
    price: item.price,
    rating: item.rating,
    reviewCount: 1234,
    image: item.image,
    ingredients: [item.mainIngredient],
    benefits: item.benefits,
    ageGroup: ['전연령'],
    size: '200g',
    madeIn: '대한민국',
    bestFor: ['전체크기'],
  });

  return (
    <div className="bg-gray-50 py-8">
      <Container>
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">알러지 비교</h2>
          <p className="text-gray-600 text-sm">원재료별로 간식을 비교하고 우리 강아지에게 맞는 제품을 찾아보세요</p>
        </div>

        {/* Meat Type Selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {meatTypes.map((meat) => (
            <button
              key={meat.id}
              onClick={() => setSelectedMeat(meat.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedMeat === meat.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="text-2xl mb-1">{meat.icon}</div>
              <div className={`text-sm ${selectedMeat === meat.id ? 'text-blue-700' : 'text-gray-700'}`}>
                {meat.name}
              </div>
            </button>
          ))}
        </div>

        {/* Products Comparison */}
        <div className="bg-white rounded-xl p-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl">{currentMeat?.icon}</span>
            <h3 className="text-gray-900">{currentMeat?.name} 기반 간식 비교</h3>
          </div>

          <div className="space-y-4 mb-4">
            {currentProducts.map((product, index) => (
              <div 
                key={index} 
                onClick={() => onProductClick && onProductClick(convertToProduct(product, `allergy-${selectedMeat}-${index}`))}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-blue-600 mb-1">{product.brand}</div>
                  <h4 className="text-gray-900 mb-3">{product.name}</h4>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">주원료</span>
                      <span className="text-gray-900 text-xs">{product.mainIngredient}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">평점</span>
                      <span className="text-gray-900">⭐ {product.rating}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">알러지 위험</span>
                      <span className={`flex items-center gap-1 ${
                        product.allergyRisk === '매우 낮음' ? 'text-green-600' :
                        product.allergyRisk === '낮음' ? 'text-blue-600' :
                        product.allergyRisk === '중간' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {product.allergyRisk === '매우 낮음' || product.allergyRisk === '낮음' ? (
                          <CheckCircle2 className="size-3" />
                        ) : (
                          <AlertTriangle className="size-3" />
                        )}
                        {product.allergyRisk}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.benefits.map((benefit, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>

                  <div className="text-gray-900">{product.price.toLocaleString()}원</div>
                </div>
              </div>
            ))}
          </div>

          {/* Allergy Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 text-yellow-600 flex-shrink-0 mt-0.5" />
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