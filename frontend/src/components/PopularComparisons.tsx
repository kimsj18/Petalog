'use client';

import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Product } from '../types';

interface PopularComparisonsProps {
  onSelectProducts: (products: Product[]) => void;
}

export function PopularComparisons({ onSelectProducts }: PopularComparisonsProps) {
  const popularComparisons = [
    {
      id: 1,
      title: '프리미엄 닭가슴살 큐브 vs 오리지널 독 트릿',
      description: '고급 육류 간식 비교',
      count: 1234,
      products: [
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
          name: '오���지널 독 트릿',
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
        }
      ]
    },
    {
      id: 2,
      title: '덴탈껌 TOP 3 비교',
      description: '치아 건강 간식 인기 비교',
      count: 856,
      products: [
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
          name: '오리지널 독 트릿',
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
        }
      ]
    },
    {
      id: 3,
      title: '연어 vs 오리고기 육포',
      description: '저알러지 간식 비교',
      count: 623,
      products: [
        {
          id: '3',
          name: '연어 스틱 저키',
          brand: '캐나다 프레시',
          price: 24500,
          originalPrice: 28000,
          rating: 4.7,
          reviewCount: 623,
          image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20231228_129%2F1703731370287c4JGR_JPEG%2F31034053804689016_791276966.jpg&type=sc960_832',
          ingredients: ['연어 90%', '고구마', '크랜베리'],
          benefits: ['피부/모질 개선', '소화 개선'],
          ageGroup: ['전연령'],
          size: '100g',
          madeIn: '캐나다',
          bestFor: ['소형견', '중형견', '대형견'],
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
        }
      ]
    }
  ];

  return (
    <div className="px-4 py-8">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">인기 비교</h2>
        <p className="text-gray-600 text-sm">다른 사람들이 많이 비교한 조합이에요</p>
      </div>

      <div className="space-y-4">
        {popularComparisons.map(comparison => (
          <div
            key={comparison.id}
            onClick={() => onSelectProducts(comparison.products)}
            className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {comparison.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{comparison.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Star className="size-3 fill-yellow-400 text-yellow-400" />
                  <span>{comparison.count.toLocaleString()}명이 비교했어요</span>
                </div>
              </div>
              <ArrowRight className="size-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              {comparison.products.slice(0, 2).map((product, index) => (
                <div key={product.id} className="flex-1 text-center">
                  <div className="text-xs text-blue-600 mb-1">{product.brand}</div>
                  <div className="text-sm text-gray-700 line-clamp-2">{product.name}</div>
                  <div className="text-sm text-gray-900 mt-1">{product.price.toLocaleString()}원</div>
                  {index === 0 && comparison.products.length === 2 && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300">vs</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}