'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterSidebarProps {
  filters: {
    priceRange: number[];
    ageGroup: string[];
    benefits: string[];
    brands: string[];
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    priceRange: number[];
    ageGroup: string[];
    benefits: string[];
    brands: string[];
  }>>;
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState({
    price: true,
    age: true,
    benefits: true,
    brands: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (category: 'ageGroup' | 'benefits' | 'brands', value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const ageGroups = ['퍼피 (1살 미만)', '어덜트 (1-7살)', '시니어 (7살 이상)', '전연령'];
  const benefitsList = ['치아 건강', '피부/모질 개선', '관절 건강', '소화 개선', '면역력 강화', '체중 관리'];
  const brandsList = ['네츄럴코어', '오리젠', '캐나다 프레시', '리얼미트', '그리니스', '더리얼'];

  return (
    <div className="w-64 flex-shrink-0 hidden lg:block">
      <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">필터</h3>
          <button
            onClick={() => setFilters({
              priceRange: [0, 100000],
              ageGroup: [],
              benefits: [],
              brands: []
            })}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            초기화
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-700">가격대</span>
            {expandedSections.price ? (
              <ChevronUp className="size-4 text-gray-500" />
            ) : (
              <ChevronDown className="size-4 text-gray-500" />
            )}
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: [0, parseInt(e.target.value)]
                }))}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>0원</span>
                <span>{filters.priceRange[1].toLocaleString()}원</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-4" />

        {/* Age Group */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('age')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-700">연령대</span>
            {expandedSections.age ? (
              <ChevronUp className="size-4 text-gray-500" />
            ) : (
              <ChevronDown className="size-4 text-gray-500" />
            )}
          </button>
          {expandedSections.age && (
            <div className="space-y-2">
              {ageGroups.map(age => (
                <label key={age} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.ageGroup.includes(age)}
                    onChange={() => handleCheckboxChange('ageGroup', age)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{age}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-4" />

        {/* Benefits */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('benefits')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-700">효능</span>
            {expandedSections.benefits ? (
              <ChevronUp className="size-4 text-gray-500" />
            ) : (
              <ChevronDown className="size-4 text-gray-500" />
            )}
          </button>
          {expandedSections.benefits && (
            <div className="space-y-2">
              {benefitsList.map(benefit => (
                <label key={benefit} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.benefits.includes(benefit)}
                    onChange={() => handleCheckboxChange('benefits', benefit)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-4" />

        {/* Brands */}
        <div>
          <button
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-gray-700">브랜드</span>
            {expandedSections.brands ? (
              <ChevronUp className="size-4 text-gray-500" />
            ) : (
              <ChevronDown className="size-4 text-gray-500" />
            )}
          </button>
          {expandedSections.brands && (
            <div className="space-y-2">
              {brandsList.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleCheckboxChange('brands', brand)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}