'use client';

import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Clock, Bone, Droplet, Cookie } from 'lucide-react';
import { Product } from '../App';
import { Container } from './common/Container';

interface SnackTypeComparisonProps {
  onProductClick?: (product: Product) => void;
}

export function SnackTypeComparison({ onProductClick }: SnackTypeComparisonProps) {
  const [selectedType, setSelectedType] = useState('treat');

  const snackTypes = [
    { id: 'treat', name: '트릿/큐브', icon: Cookie, color: 'blue', desc: '훈련용, 간식용' },
    { id: 'jerky', name: '육포/저키', icon: Bone, color: 'orange', desc: '씹는 재미' },
    { id: 'churu', name: '츄르/액상', icon: Droplet, color: 'purple', desc: '수분 보충' },
    { id: 'dental', name: '덴탈껌', icon: Clock, color: 'green', desc: '치아 건강' },
  ];

  const products = {
    treat: [
      {
        name: '프리미엄 닭가슴살 큐브',
        brand: '네츄럴코어',
        price: 18900,
        size: '200g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['작은 크기', '훈련��� 최적', '휴대 간편'],
        rating: 4.8,
        bestFor: '훈련, 외출',
      },
      {
        name: '오리지널 독 트릿',
        brand: '오리젠',
        price: 32000,
        size: '92g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['프리미엄', '고단백', '저탄수'],
        rating: 4.9,
        bestFor: '특별한 보상',
      },
      {
        name: '치즈 트릿',
        brand: '그리니스',
        price: 9900,
        size: '150g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['가성비', '치즈 맛', '기호성 좋음'],
        rating: 4.6,
        bestFor: '일상 간식',
      },
    ],
    jerky: [
      {
        name: '오리고기 육포',
        brand: '더리얼',
        price: 21000,
        size: '150g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['오래 씹음', '단일 육류', '무첨가'],
        rating: 4.8,
        bestFor: '스트레스 해소',
      },
      {
        name: '연어 스틱 저키',
        brand: '캐나다 프레시',
        price: 24500,
        size: '100g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['오메가-3', '피부/모질', '저알러지'],
        rating: 4.7,
        bestFor: '피부 건강',
      },
      {
        name: '소고기 육포',
        brand: '더리얼',
        price: 23000,
        size: '120g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['철분 풍부', '쫄깃함', '기호성 최고'],
        rating: 4.8,
        bestFor: '영양 보충',
      },
    ],
    churu: [
      {
        name: '닭가슴살 츄르',
        brand: '리얼미트',
        price: 15800,
        size: '120g (10개입)',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['수분 보충', '약 먹일 때', '개별 포장'],
        rating: 4.7,
        bestFor: '투약 보조',
      },
      {
        name: '연어 크림 스낵',
        brand: '캐나다 프레시',
        price: 18500,
        size: '140g (14개입)',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['부드러움', '시니어 적합', 'DHA 함유'],
        rating: 4.8,
        bestFor: '노령견',
      },
      {
        name: '관절 케어 츄르',
        brand: '리얼미트',
        price: 16900,
        size: '100g (10개입)',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['글루코사민', '관절 건강', '기능성'],
        rating: 4.6,
        bestFor: '관절 약한 견',
      },
    ],
    dental: [
      {
        name: '치즈 덴탈껌',
        brand: '그리니스',
        price: 12900,
        size: '300g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['치석 제거', '구취 제거', '매일 급여'],
        rating: 4.5,
        bestFor: '치아 관리',
      },
      {
        name: '프리미엄 닭가슴살 큐브',
        brand: '네츄럴코어',
        price: 18900,
        size: '200g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['자연 치석 제거', '씹는 재미', '육류 100%'],
        rating: 4.8,
        bestFor: '자연 양치',
      },
      {
        name: '민트 덴탈 스틱',
        brand: '그리니스',
        price: 11500,
        size: '250g',
        image: 'https://images.unsplash.com/photo-1604544203292-0daa7f847478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB0cmVhdHMlMjBzbmFja3N8ZW58MXx8fHwxNzY1ODU2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        features: ['민트 향', '입냄새 제거', '저칼로리'],
        rating: 4.4,
        bestFor: '구취 심한 견',
      },
    ],
  };

  const currentProducts = products[selectedType as keyof typeof products] || [];
  const currentType = snackTypes.find(t => t.id === selectedType);
  const Icon = currentType?.icon || Cookie;

  // 간식 제품을 Product 타입으로 변환
  const convertToProduct = (item: any, id: string): Product => ({
    id,
    name: item.name,
    brand: item.brand,
    price: item.price,
    rating: item.rating,
    reviewCount: 1234,
    image: item.image,
    ingredients: ['주원료 100%'],
    benefits: item.features,
    ageGroup: ['전연령'],
    size: item.size,
    madeIn: '대한민국',
    bestFor: [item.bestFor],
  });

  return (
    <div className="bg-white py-8">
      <Container>
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">간식 종류별 비교</h2>
          <p className="text-gray-600 text-sm">용도에 맞는 간식 타입을 선택하고 비교해보세요</p>
        </div>

        {/* Snack Type Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {snackTypes.map((type) => {
            const TypeIcon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedType === type.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <TypeIcon className={`size-6 mb-2 ${
                  selectedType === type.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div className={`text-sm mb-1 ${selectedType === type.id ? 'text-blue-700' : 'text-gray-900'}`}>
                  {type.name}
                </div>
                <div className="text-xs text-gray-600">{type.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Products Comparison */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="mb-4 flex items-center gap-2">
            <Icon className="size-5 text-blue-600" />
            <h3 className="text-gray-900">{currentType?.name} 비교</h3>
          </div>

          <div className="space-y-4 mb-4">
            {currentProducts.map((product, index) => (
              <div 
                key={index} 
                onClick={() => onProductClick && onProductClick(convertToProduct(product, `snacktype-${selectedType}-${index}`))}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer"
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
                  <h4 className="text-gray-900 mb-2">{product.name}</h4>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">용량</span>
                      <span className="text-gray-900">{product.size}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">평점</span>
                      <span className="text-gray-900">⭐ {product.rating}</span>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-600 mb-1">추천 용도</div>
                      <div className="text-blue-600 text-xs">{product.bestFor}</div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="text-xs text-gray-700 flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-600 rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="text-gray-900">{product.price.toLocaleString()}원</div>
                </div>
              </div>
            ))}
          </div>

          {/* Type Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon className="size-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="text-blue-900 mb-1">{currentType?.name} 특징</div>
                <div className="text-blue-800">
                  {selectedType === 'treat' && '작고 휴대하기 편해서 훈련이나 외출 시 사용하기 좋습니다. 자주 급여하므로 칼로리가 낮은 제품을 선택하세요.'}
                  {selectedType === 'jerky' && '씹는 시간이 길어 스트레스 해소에 도움이 됩니다. 단일 육류 제품이 많아 알러지 관리에 유리합니다.'}
                  {selectedType === 'churu' && '부드러워서 시니어견이나 이빨이 약한 강아지에게 좋습니다. 수분 보충과 투약 보조로 활용하세요.'}
                  {selectedType === 'dental' && '씹으면서 치석을 제거하고 잇몸을 마사지합니다. 매일 급여하면 구강 건강 유지에 도움이 됩니다.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}