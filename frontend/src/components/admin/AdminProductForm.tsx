'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { 

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

interface Ingredient {
  id: string;
  name: string;
  percentage: string;
}

interface ImageFile {
  file: File;
  preview: string;
}

interface ProductFormData {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  originalPrice: string;
  quantity: string;
  size: string;
  ageGroup: string[];
  madeIn: string;
  stockQuantity: string;
  images: ImageFile[];
  ingredients: Ingredient[];
  benefits: string[];
}

interface IngredientDTO {
  name: string;
  percentage: number;
}

interface BenefitDTO {
  name: string;
}

interface ProductDetailDTO {
  productsId: string;
  name: string;
  brand: string;
  category: string;
  snackType: string;
  imageUrl: string;
  quantity: number;
  madeIn: string;
  size: number;
  price: number;
  description: string;
  ingredientDTOs: IngredientDTO[];
  benefitDTOs: BenefitDTO[];
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
    quantity:'',
    size: '',
    ageGroup: [],
    madeIn: '',
    stockQuantity: '',
    images: [],
    ingredients: [],
    benefits: [],
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');

  // 이미지 파일 처리 함수
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFiles: File[] = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setErrors(prev => [...prev, '이미지 파일만 업로드 가능합니다.']);
      return;
    }

    // 현재 이미지 개수 확인
    const remainingSlots = 3 - formData.images.length;
    const filesToAdd = imageFiles.slice(0, remainingSlots);

    if (filesToAdd.length < imageFiles.length) {
      setErrors(prev => [...prev, `최대 3개까지만 업로드 가능합니다. ${filesToAdd.length}개만 추가됩니다.`]);
    }

    // 모든 파일을 Promise로 변환하여 동시에 처리
    const imagePromises = filesToAdd.map((file) => {
      return new Promise<ImageFile>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const preview = reader.result as string;
          resolve({ file, preview });
        };
        reader.readAsDataURL(file);
      });
    });

    const newImages = await Promise.all(imagePromises);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 3),
    }));

    // input 초기화 (같은 파일을 다시 선택할 수 있도록)
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  // 드롭다운 옵션들
  const brands = ['네츄럴코어', '오리젠', '그리니스', '덴티베이트', '하림펫푸드', '기타'];
  const categories = [
    { id: 'treat', name: '트릿/큐브', icon: '🦴' },
    { id: 'jerky', name: '육포/저키', icon: '🥩' },
    { id: 'churu', name: '츄르/액상', icon: '💧' },
    { id: 'dental', name: '덴탈껌', icon: '🦷' },
    { id: 'cookie', name: '쿠키/비스킷', icon: '🍪' },
  ];
  // const ageGroups = ['전연령', '퍼피', '성견', '노견'];
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

  // const handleAgeGroupToggle = (age: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     ageGroup: prev.ageGroup.includes(age)
  //       ? prev.ageGroup.filter(a => a !== age)
  //       : [...prev.ageGroup, age],
  //   }));
  // };

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
    setFormData(prev => {
      const updatedIngredients = prev.ingredients.map(ing =>
        ing.id === id ? { ...ing, [field]: value } : ing
      );
      
      // 비율 합계 검증
      const totalPercentage = updatedIngredients.reduce((sum, ing) => {
        const percentage = parseFloat(ing.percentage) || 0;
        return sum + percentage;
      }, 0);
      
      return {
        ...prev,
        ingredients: updatedIngredients,
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('제품명을 입력해주세요.');
    if (!formData.brand) newErrors.push('브랜드를 선택해주세요.');
    if (!formData.category) newErrors.push('카테고리를 선택해주세요.');
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.push('올바른 가격을 입력해주세요.');
    if (!formData.size.trim()) newErrors.push('용량을 입력해주세요.');
    if (!formData.madeIn) newErrors.push('원산지를 선택해주세요.');
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.push('재고 수량을 입력해주세요.');
    // if (formData.ageGroup.length === 0) newErrors.push('적합 연령대를 최소 1개 선택해주세요.');
    if (formData.images.length === 0) newErrors.push('이미지를 최소 1개 업로드해주세요.');
    if (formData.ingredients.length === 0) newErrors.push('원재료를 최소 1개 추가해주세요.');
    if (formData.benefits.length === 0) newErrors.push('효능을 최소 1개 선택해주세요.');

    // 원재료 검증
    formData.ingredients.forEach((ing, idx) => {
      if (!ing.name) newErrors.push(`${idx + 1}번째 원재료명을 입력해주세요.`);
      if (ing.percentage && (parseFloat(ing.percentage) < 0 || parseFloat(ing.percentage) > 100)) {
        newErrors.push(`${idx + 1}번째 원재료 비율은 0-100 사이여야 합니다.`);
      }
    });

    // 원재료 비율 합계 검증
    const totalPercentage = formData.ingredients.reduce((sum, ing) => {
      const percentage = parseFloat(ing.percentage) || 0;
      return sum + percentage;
    }, 0);
    
    if (totalPercentage > 100) {
      newErrors.push(`원재료 비율의 합계가 100%를 초과할 수 없습니다. (현재: ${totalPercentage.toFixed(1)}%)`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // FormData로 이미지 파일과 함께 전송
      const submitData = new FormData();
      
      // 기본 정보 추가
      submitData.append('name', formData.name);
      submitData.append('brand', formData.brand);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('size', formData.size);
      submitData.append('quantity', formData.quantity)
      submitData.append('madeIn', formData.madeIn);

      // 이미지 파일 추가 (새로 추가된 파일만)
      formData.images.forEach((image) => {
        // File 객체이고 실제 파일인 경우만 추가 (기존 이미지 URL은 제외)
        // preview가 data URL이거나 file.name이 있는 경우는 새로 추가된 파일
        if (image.file && image.file instanceof File && 
            (image.file.size > 0 || image.preview.startsWith('data:'))) {
          submitData.append(`images`, image.file);
        }
      });
      
      // 원재료 추가
      submitData.append('ingredients', JSON.stringify(formData.ingredients));
      
      // 효능 추가
      submitData.append('benefits', JSON.stringify(formData.benefits));

      try {
        // 수정 모드일 때 productsId와 기존 이미지 URL 추가
        if (mode === 'edit' && productId) {
          submitData.append('productsId', productId);

          // 기존 이미지 URL들 추출하여 전송
          const existingImageUrls: string[] = [];
          formData.images.forEach((image) => {
            // 새로 추가된 파일이 아닌 경우 (기존 이미지 URL)
            // preview가 http:// 또는 https:// 또는 /uploads/로 시작하면 기존 이미지
            if (image.preview &&
                !image.preview.startsWith('data:') &&
                (image.preview.startsWith('http') || image.preview.startsWith('/uploads'))) {
              existingImageUrls.push(image.preview);
            }
          });

          // 기존 이미지 URL들을 콤마로 구분하여 전송
          if (existingImageUrls.length > 0) {
            submitData.append('imageUrl', existingImageUrls.join(','));
          }
        }

        let response;
        if (mode === 'edit' && productId) {
          // 수정 모드: 현재는 수정 API가 없으므로 생성 API 재사용
          // TODO: 백엔드에 수정 API 추가 후 PUT 요청으로 변경
          response = await apiClient.post<{ id: string }>(`/v1/admin/products/${productId}/edit`, submitData);
        } else {
          // 생성 모드
          response = await apiClient.post<{ id: string }>('/v1/admin/products/new', submitData);
        }

        if (response.success) {
          router.push('/admin/products');
        } else {
          setErrors([response.error || `제품 ${mode === 'edit' ? '수정' : '등록'}에 실패했습니다. 다시 시도해주세요.`]);
        }
      } catch (error) {
        setErrors([`제품 ${mode === 'edit' ? '수정' : '등록'} 중 오류가 발생했습니다.`]);
      }
    }
  };

  const handlePreview = () => {
    if (validateForm()) {
      setIsPreview(true);
    }
  };

  useEffect(() => {
    if (mode === 'edit' && productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          setErrors([]);
          
          // 전체 상품 목록에서 해당 상품 찾기
          const response = await apiClient.get<ProductDetailDTO[]>('/v1/admin/products');
          
          if (response.success && response.data) {
            const product = response.data.find(p => p.productsId === productId);
            
            if (product) {
              // 이미지 URL 처리
              const imageUrls = product.imageUrl ? product.imageUrl.split(',').map(url => url.trim()).filter(url => url) : [];
              const imageFiles: ImageFile[] = [];
              
              // 기존 이미지 URL을 ImageFile 형식으로 변환
              // 실제 File 객체는 없지만 preview로 URL 사용
              for (const url of imageUrls) {
                if (url) {
                  // URL을 그대로 preview로 사용 (File 객체는 빈 파일로 생성)
                  imageFiles.push({ 
                    file: new File([], url.split('/').pop() || 'image.png', { type: 'image/png' }), 
                    preview: url 
                  });
                }
              }
              
              setFormData({
                name: product.name || '',
                brand: product.brand || '',
                category: product.category || '',
                description: product.description || '',
                price: product.price?.toString() || '',
                originalPrice: '',
                quantity:product.quantity?.toString() || '',
                size: product.size?.toString() || '',
                ageGroup: [],
                madeIn: product.madeIn || '',
                stockQuantity: '0', // DB에 재고 정보가 없으면 기본값
                images: imageFiles,
                ingredients: product.ingredientDTOs?.map((ing, idx) => ({
                  id: Date.now().toString() + idx,
                  name: ing.name || '',
                  percentage: ing.percentage?.toString() || '',
                })) || [],
                benefits: product.benefitDTOs?.map(ben => ben.name) || [],
              });
            } else {
              setErrors(['상품을 찾을 수 없습니다.']);
            }
          } else {
            setErrors(['상품 정보를 불러오는데 실패했습니다.']);
          }
        } catch (error) {
          console.error('상품 조회 실패:', error);
          setErrors(['상품 정보를 불러오는 중 오류가 발생했습니다.']);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [mode, productId]);

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">상품 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
        {/* 헤더 */}
        <div className="bg-blue-600 text-white px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Package className="size-6" />
              <h1 className="text-xl">{mode === 'edit' ? '제품 수정' : '제품 등록'}</h1>
            </div>
            <button
              onClick={() => router.push('/admin/products')}
              className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm">
            {mode === 'edit' ? '강아지 간식 제품 정보를 수정합니다' : '새로운 강아지 간식 제품을 등록합니다'}
          </p>
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
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* 제품 이미지 */}
          <section>
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="size-5 text-blue-600" />
              제품 이미지 (최대 3개) 첫번째 썸네일, 나머지 상품설명
            </h2>

            <div className="space-y-3">
              {formData.images.map((image, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm flex items-center">
                      {image.file.name || '기존 이미지'}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={image.preview} 
                      alt={`미리보기 ${idx + 1}`} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=이미지+로드+실패';
                      }}
                    />
                  </div>
                </div>
              ))}

              {formData.images.length < 3 && (
                <label className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Plus className="size-5" />
                  이미지 추가 ({formData.images.length}/3)
                </label>
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
              {/*<div>*/}
              {/*  <label className="block text-sm text-gray-700 mb-2">*/}
              {/*    적합 연령대 <span className="text-red-500">*</span>*/}
              {/*  </label>*/}
              {/*  <div className="flex flex-wrap gap-2">*/}
              {/*    {ageGroups.map(age => (*/}
              {/*      <button*/}
              {/*        key={age}*/}
              {/*        type="button"*/}
              {/*        onClick={() => handleAgeGroupToggle(age)}*/}
              {/*        className={`px-4 py-2 rounded-lg border transition-colors ${*/}
              {/*          formData.ageGroup.includes(age)*/}
              {/*            ? 'bg-blue-600 text-white border-blue-600'*/}
              {/*            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'*/}
              {/*        }`}*/}
              {/*      >*/}
              {/*        {age}*/}
              {/*      </button>*/}
              {/*    ))}*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </section>

          {/* 원재료 */}
          <section>
            <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="size-5 text-blue-600" />
              원재료 <span className="text-red-500">*</span>
            </h2>

            <div className="space-y-3">
              {formData.ingredients.map((ingredient, idx) => {
                const currentTotal = formData.ingredients.reduce((sum, ing) => {
                  const percentage = parseFloat(ing.percentage) || 0;
                  return sum + percentage;
                }, 0);
                const currentPercentage = parseFloat(ingredient.percentage) || 0;
                const otherTotal = currentTotal - currentPercentage;
                const maxAllowed = 100 - otherTotal;
                
                return (
                  <div key={ingredient.id} className="space-y-1">
                    <div className="flex gap-2">
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
                          onChange={(e) => {
                            const value = e.target.value;
                            const numValue = parseFloat(value);
                            if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= maxAllowed)) {
                              updateIngredient(ingredient.id, 'percentage', value);
                            }
                          }}
                          placeholder="비율(%)"
                          max={maxAllowed}
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
                    {maxAllowed < 100 && (
                      <p className="text-xs text-gray-500 ml-1">
                        최대 {maxAllowed.toFixed(1)}%까지 입력 가능 (현재 합계: {otherTotal.toFixed(1)}%)
                      </p>
                    )}
                  </div>
                );
              })}
              
              {formData.ingredients.length > 0 && (() => {
                const total = formData.ingredients.reduce((sum, ing) => {
                  const percentage = parseFloat(ing.percentage) || 0;
                  return sum + percentage;
                }, 0);
                return (
                  <div className={`p-3 rounded-lg ${total > 100 ? 'bg-red-50 border border-red-200' : total === 100 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <p className={`text-sm ${total > 100 ? 'text-red-700' : total === 100 ? 'text-green-700' : 'text-gray-600'}`}>
                      원재료 비율 합계: <strong>{total.toFixed(1)}%</strong>
                      {total > 100 && <span className="ml-2">⚠️ 100%를 초과했습니다</span>}
                      {total === 100 && <span className="ml-2">✓ 완벽합니다</span>}
                    </p>
                  </div>
                );
              })()}

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
              {mode === 'edit' ? '수정하기' : '등록하기'}
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

                {formData.images.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {formData.images.map((image, idx) => (
                      <img 
                        key={idx}
                        src={image.preview} 
                        alt={`${formData.name} ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=이미지+로드+실패';
                        }}
                      />
                    ))}
                  </div>
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
                          <p key={ing.id} className="text-sm text-gray-600">
                            • {ing.name} {ing.percentage && `(${ing.percentage}%)`}
                          </p>
                        ))}
                      </div>
                      {(() => {
                        const total = formData.ingredients.reduce((sum, ing) => {
                          const percentage = parseFloat(ing.percentage) || 0;
                          return sum + percentage;
                        }, 0);
                        return total > 0 && (
                          <p className="text-sm text-gray-500 mt-2">
                            총 비율: {total.toFixed(1)}%
                            {total > 100 && <span className="text-red-500 ml-2">(100% 초과)</span>}
                          </p>
                        );
                      })()}
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