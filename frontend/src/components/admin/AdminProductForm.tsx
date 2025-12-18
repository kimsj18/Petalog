'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Package, 
  DollarSign, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  Scale,
  AlertCircle,
  CheckCircle,
  X,
  Plus
} from 'lucide-react';

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  originalPrice: string;
  size: string;
  ageGroup: string[];
  madeIn: string;
  stockQuantity: string;
  imageUrl: string;
  ingredients: Array<{ id: string; name: string; percentage: string }>;
  benefits: string[];
}

interface AdminProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export function AdminProductForm({ mode, productId }: AdminProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    size: '',
    ageGroup: [],
    madeIn: '',
    stockQuantity: '',
    imageUrl: '',
    ingredients: [],
    benefits: [],
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  // 드롭다운 옵션들
  const brands = ['네츄럴코어', '오리젠', '그리니스', '덴티베이트', '하림펫푸드', '기타'];
  const categories = [
    { id: 'treat', name: '트릿/큐브', icon: '🦴' },
    { id: 'jerky', name: '육포/저키', icon: '🥩' },
    { id: 'churu', name: '츄르/액상', icon: '💧' },
    { id: 'dental', name: '덴탈껌', icon: '🦷' },
    { id: 'cookie', name: '쿠키/비스킷', icon: '🍪' },
  ];
  const ageGroups = ['전연령', '퍼피', '성견', '노견'];
  const countries = ['한국', '미국', '캐나다', '뉴질랜드', '호주', '독일', '기타'];
  
  const availableIngredients = [
    '닭가슴살', '소고기', '돼지고기', '오리고기', '연어', '참치',
    '고구마', '호박', '감자', '당근', '브로콜리',
    '글리세린', '천연향료', '비타민E', '타우린'
  ];
  
  const availableBenefits = [
    '치아 건강', '소화 개선', '피부 개선', '관절 건강', '면역력 강화', '체중 관리'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgeGroupToggle = (age: string) => {
    setFormData(prev => ({
      ...prev,
      ageGroup: prev.ageGroup.includes(age)
        ? prev.ageGroup.filter(a => a !== age)
        : [...prev.ageGroup, age],
    }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: Date.now().toString(), name: '', percentage: '' }],
    }));
  };

  const removeIngredient = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id),
    }));
  };

  const updateIngredient = (id: string, field: 'name' | 'percentage', value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing =>
        ing.id === id ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('제품명을 입력해주세요.');
    if (!formData.brand) newErrors.push('브랜드를 선택해주세요.');
    if (!formData.category) newErrors.push('카테고리를 선택해주세요.');
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.push('올바른 가격을 입력해주세요.');
    if (!formData.size.trim()) newErrors.push('용량을 입력해주세요.');
    if (!formData.madeIn) newErrors.push('원산지를 선택해주세요.');
    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) newErrors.push('재고 수량을 입력해주세요.');
    if (formData.ageGroup.length === 0) newErrors.push('적합 연령대를 최소 1개 선택해주세요.');
    if (formData.ingredients.length === 0) newErrors.push('원재료를 최소 1개 추가해주세요.');
    if (formData.benefits.length === 0) newErrors.push('효능을 최소 1개 선택해주세요.');

    // 원재료 검증
    formData.ingredients.forEach((ing, idx ) => {
      if (!ing.name) newErrors.push(`${idx + 1}번째 원재료명을 입력해주세요.`);
      if (ing.percentage && (parseFloat(ing.percentage) < 0 || parseFloat(ing.percentage) > 100)) {
        newErrors.push(`${idx + 1}번째 원재료 비율은 0-100 사이여야 합니다.`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // 실제 서버에 데이터를 보내는 로직을 여기에 추가하세요
      // 예: fetch('/api/products', { method: 'POST', body: JSON.stringify(formData) });
      console.log('제품 등록:', formData);
      router.push('/admin/products');
    }
  };

  const handlePreview = () => {
    if (validateForm()) {
      setIsPreview(true);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && productId) {
      // 실제 서버에서 데이터를 가져오는 로직을 여기에 추가하세요
      // 예: fetch(`/api/products/${productId}`).then(res => res.json()).then(data => setFormData(data));
      const sampleData: ProductFormData = {
        name: '프리미엄 닭가슴살 큐브',
        brand: '네츄럴코어',
        category: 'treat',
        description: '강아지에게 좋은 닭가슴살 큐브',
        price: '15000',
        originalPrice: '20000',
        size: '200g',
        ageGroup: ['전연령', '퍼피'],
        madeIn: '한국',
        stockQuantity: '100',
        imageUrl: 'https://example.com/image.jpg',
        ingredients: [
          { id: '1', name: '닭가슴살', percentage: '50' },
          { id: '2', name: '고구마', percentage: '30' },
        ],
        benefits: ['치아 건강', '소화 개선'],
      };
      setFormData(sampleData);
    }
  }, [mode, productId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
        {/* 헤더 */}
        <div className="bg-blue-600 text-white px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package className="size-6" />
              <h1 className="text-xl">제품 등록</h1>
            </div>
            <button
              onClick={() => router.push('/admin/products')}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm">새로운 강아지 간식 제품을 등록합니다</p>
        </div>

        {/* 에러 메시지 */}
        {errors.length > 0 && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 mb-2">다음 항목을 확인해주세요:</p>
                <ul className="text-sm text-red-600 space-y-1">
                  {errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
          {/* 기본 정보 */}
          <section>
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Package className="size-5 text-blue-600" />
              기본 정보
            </h2>

            <div className="space-y-4">
              {/* 제품명 */}
              <div>
                <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
                  제품명 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="예: 프리미엄 닭가슴살 큐브"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 브랜드 */}
              <div>
                <label htmlFor="brand" className="block text-sm text-gray-700 mb-2">
                  브랜드 <span className="text-red-500">*</span>
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택해주세요</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* 카테고리 */}
              <div>
                <label htmlFor="category" className="block text-sm text-gray-700 mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택해주세요</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 제품 설명 */}
              <div>
                <label htmlFor="description" className="block text-sm text-gray-700 mb-2">
                  제품 설명
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="제품의 특징과 장점을 입력하세요"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* 가격 및 재고 */}
          <section>
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="size-5 text-blue-600" />
              가격 및 재고
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm text-gray-700 mb-2">
                  판매가 (원) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="15000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/*<div>*/}
              {/*  <label htmlFor="originalPrice" className="block text-sm text-gray-700 mb-2">*/}
              {/*    정가 (원)*/}
              {/*  </label>*/}
              {/*  <input*/}
              {/*    id="originalPrice"*/}
              {/*    name="originalPrice"*/}
              {/*    type="number"*/}
              {/*    value={formData.originalPrice}*/}
              {/*    onChange={handleChange}*/}
              {/*    placeholder="20000"*/}
              {/*    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
              {/*  />*/}
              {/*</div>*/}

              <div>
                <label htmlFor="size" className="block text-sm text-gray-700 mb-2">
                  용량 <span className="text-red-500">*</span>
                </label>
                <input
                  id="size"
                  name="size"
                  type="text"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="200g"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm text-gray-700 mb-2">
                  재고 수량 <span className="text-red-500">*</span>
                </label>
                <input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* 제품 이미지 */}
          <section>
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="size-5 text-blue-600" />
              제품 이미지
            </h2>

            <div>
              <label htmlFor="imageUrl" className="block text-sm text-gray-700 mb-2">
                이미지 URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.imageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={formData.imageUrl} 
                    alt="미리보기" 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=이미지+로드+실패';
                    }}
                  />
                </div>
              )}
            </div>
          </section>

          {/* 추가 정보 */}
          <section>
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="size-5 text-blue-600" />
              추가 정보
            </h2>

            <div className="space-y-4">
              {/* 원산지 */}
              <div>
                <label htmlFor="madeIn" className="block text-sm text-gray-700 mb-2">
                  원산지 <span className="text-red-500">*</span>
                </label>
                <select
                  id="madeIn"
                  name="madeIn"
                  value={formData.madeIn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택해주세요</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* 적합 연령대 */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  적합 연령대 <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ageGroups.map(age => (
                    <button
                      key={age}
                      type="button"
                      onClick={() => handleAgeGroupToggle(age)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        formData.ageGroup.includes(age)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 원재료 */}
          <section>
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="size-5 text-blue-600" />
              원재료 <span className="text-red-500">*</span>
            </h2>

            <div className="space-y-3">
              {formData.ingredients.map((ingredient, idx) => (
                <div key={ingredient.id} className="flex gap-2">
                  <div className="flex-1">
                    <select
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">원재료 선택</option>
                      {availableIngredients.map(ing => (
                        <option key={ing} value={ing}>{ing}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      value={ingredient.percentage}
                      onChange={(e) => updateIngredient(ingredient.id, 'percentage', e.target.value)}
                      placeholder="비율(%)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addIngredient}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="size-5" />
                원재료 추가
              </button>
            </div>
          </section>

          {/* 효능 */}
          <section>
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="size-5 text-blue-600" />
              효능 <span className="text-red-500">*</span>
            </h2>

            <div className="flex flex-wrap gap-2">
              {availableBenefits.map(benefit => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => handleBenefitToggle(benefit)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.benefits.includes(benefit)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
          </section>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handlePreview}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              미리보기
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="size-5" />
              등록하기
            </button>
          </div>
        </form>

        {/* 미리보기 모달 */}
        {isPreview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg text-gray-900">미리보기</h3>
                  <button
                    onClick={() => setIsPreview(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {formData.imageUrl && (
                  <img 
                    src={formData.imageUrl} 
                    alt={formData.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">{formData.brand}</p>
                    <h4 className="text-lg text-gray-900">{formData.name}</h4>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl text-blue-600">{parseInt(formData.price).toLocaleString()}원</span>
                    {formData.originalPrice && parseInt(formData.originalPrice) > parseInt(formData.price) && (
                      <span className="text-sm text-gray-400 line-through">
                        {parseInt(formData.originalPrice).toLocaleString()}원
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map(benefit => (
                      <span key={benefit} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                        {benefit}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                    <p className="text-gray-600">용량: {formData.size}</p>
                    <p className="text-gray-600">원산지: {formData.madeIn}</p>
                    <p className="text-gray-600">적합 연령: {formData.ageGroup.join(', ')}</p>
                    <p className="text-gray-600">재고: {formData.stockQuantity}개</p>
                  </div>

                  {formData.ingredients.length > 0 && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-sm text-gray-700 mb-2">원재료:</p>
                      <div className="space-y-1">
                        {formData.ingredients.map((ing, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            • {ing.name} {ing.percentage && `(${ing.percentage}%)`}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.description && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-sm text-gray-700 mb-2">제품 설명:</p>
                      <p className="text-sm text-gray-600">{formData.description}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsPreview(false)}
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}