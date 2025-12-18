'use client';

import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Scale, Search, TrendingUp } from 'lucide-react';

export function Hero({ onCompareClick }: { onCompareClick: () => void }) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-12">
      <div className="px-4">
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">
            강아지 간식, 비교하고<br />
            똑똑하게 선택하세요
          </h2>
          <p className="text-gray-600 text-sm">
            성분, 가격, 리뷰까지 한눈에 비교<br />
            우리 강아지에게 가장 좋은 간식을 찾아보세요
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white p-3 rounded-lg text-center">
            <Scale className="size-6 text-blue-600 mx-auto mb-1" />
            <div className="text-gray-900 text-sm mb-0.5">3개 비교</div>
            <div className="text-xs text-gray-600">한눈에 비교</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <Search className="size-6 text-blue-600 mx-auto mb-1" />
            <div className="text-gray-900 text-sm mb-0.5">성분 분석</div>
            <div className="text-xs text-gray-600">투명한 정보</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center">
            <TrendingUp className="size-6 text-blue-600 mx-auto mb-1" />
            <div className="text-gray-900 text-sm mb-0.5">가격 비교</div>
            <div className="text-xs text-gray-600">최저가 발견</div>
          </div>
        </div>

        <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1692906456159-f93a6f3df407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGVhdGluZ3xlbnwxfHx8fDE3NjU3NzgxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Happy dog with treats"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          onClick={onCompareClick}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
        >
          지금 비교 시작하기
        </button>
      </div>
    </div>
  );
}