import { Product, Ingredient, ProductBenefit } from '@/types';

// ========================================
// Mock Products (DB 스키마 기반)
// ========================================

export const mockProducts: Product[] = [
  // 닭고기 간식
  {
    products_id: 'PROD001',
    name: '프리미엄 닭가슴살 큐브',
    brand: '펫밀리',
    category: '간식',
    snack_type: '트릿',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400',
    price: 15000,
    originalPrice: 18000,
    rating: 4.8,
    reviewCount: 234,
    size: '200g',
    madeIn: '한국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING001', products_id: 'PROD001', ingredients_name: '닭' }
    ],
    benefits: [
      { benefit_id: 'BEN001', products_id: 'PROD001', benefit_name: '면역력 강화' },
      { benefit_id: 'BEN002', products_id: 'PROD001', benefit_name: '피부/모질 개선' }
    ]
  },
  {
    products_id: 'PROD002',
    name: '닭가슴살 져키',
    brand: '도그푸드',
    category: '간식',
    snack_type: '육포',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    price: 12000,
    originalPrice: 15000,
    rating: 4.6,
    reviewCount: 189,
    size: '150g',
    madeIn: '한국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING002', products_id: 'PROD002', ingredients_name: '닭' }
    ],
    benefits: [
      { benefit_id: 'BEN003', products_id: 'PROD002', benefit_name: '식이조절' },
      { benefit_id: 'BEN004', products_id: 'PROD002', benefit_name: '단백질 보충' }
    ]
  },

  // 소고기 간식
  {
    products_id: 'PROD003',
    name: '프리미엄 소고기 큐브',
    brand: '펫밀리',
    category: '간식',
    snack_type: '트릿',
    imageUrl: 'https://images.unsplash.com/photo-1588611824626-493d5f69bea0?w=400',
    price: 18000,
    originalPrice: 22000,
    rating: 4.9,
    reviewCount: 312,
    size: '200g',
    madeIn: '한국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING003', products_id: 'PROD003', ingredients_name: '소' }
    ],
    benefits: [
      { benefit_id: 'BEN005', products_id: 'PROD003', benefit_name: '근육 발달' },
      { benefit_id: 'BEN006', products_id: 'PROD003', benefit_name: '면역력 강화' }
    ]
  },
  {
    products_id: 'PROD004',
    name: '소고기 져키 스틱',
    brand: '도그푸드',
    category: '간식',
    snack_type: '육포',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400',
    price: 16000,
    originalPrice: 19000,
    rating: 4.7,
    reviewCount: 267,
    size: '180g',
    madeIn: '한국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING004', products_id: 'PROD004', ingredients_name: '소' }
    ],
    benefits: [
      { benefit_id: 'BEN007', products_id: 'PROD004', benefit_name: '치아 건강' },
      { benefit_id: 'BEN008', products_id: 'PROD004', benefit_name: '스트레스 해소' }
    ]
  },

  // 돼지고기 간식
  {
    products_id: 'PROD005',
    name: '돼지 귀 껌',
    brand: '네추럴펫',
    category: '간식',
    snack_type: '껌',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    price: 8000,
    originalPrice: 10000,
    rating: 4.5,
    reviewCount: 156,
    size: '100g',
    madeIn: '베트남',
    ageGroup: ['성견'],
    ingredients: [
      { ingredients_id: 'ING005', products_id: 'PROD005', ingredients_name: '돼지' }
    ],
    benefits: [
      { benefit_id: 'BEN009', products_id: 'PROD005', benefit_name: '치아 건강' },
      { benefit_id: 'BEN010', products_id: 'PROD005', benefit_name: '스트레스 해소' }
    ]
  },
  {
    products_id: 'PROD006',
    name: '돼지고기 트릿',
    brand: '펫밀리',
    category: '간식',
    snack_type: '트릿',
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400',
    price: 13000,
    originalPrice: 16000,
    rating: 4.4,
    reviewCount: 142,
    size: '150g',
    madeIn: '한국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING006', products_id: 'PROD006', ingredients_name: '돼지' }
    ],
    benefits: [
      { benefit_id: 'BEN011', products_id: 'PROD006', benefit_name: '단백질 보충' },
      { benefit_id: 'BEN012', products_id: 'PROD006', benefit_name: '피부/모질 개선' }
    ]
  },

  // 양고기 간식
  {
    products_id: 'PROD007',
    name: '양고기 큐브',
    brand: '네추럴펫',
    category: '간식',
    snack_type: '트릿',
    imageUrl: 'https://images.unsplash.com/photo-1597933534024-26698747a44b?w=400',
    price: 20000,
    originalPrice: 24000,
    rating: 4.6,
    reviewCount: 98,
    size: '150g',
    madeIn: '뉴질랜드',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING007', products_id: 'PROD007', ingredients_name: '양' }
    ],
    benefits: [
      { benefit_id: 'BEN013', products_id: 'PROD007', benefit_name: '저알러지' },
      { benefit_id: 'BEN014', products_id: 'PROD007', benefit_name: '면역력 강화' }
    ]
  },

  // 츄르/액상 간식
  {
    products_id: 'PROD008',
    name: '닭고기 츄르',
    brand: '도그푸드',
    category: '간식',
    snack_type: '츄르',
    imageUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400',
    price: 12000,
    rating: 4.9,
    reviewCount: 421,
    size: '14g x 20개',
    madeIn: '한국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING008', products_id: 'PROD008', ingredients_name: '닭' }
    ],
    benefits: [
      { benefit_id: 'BEN015', products_id: 'PROD008', benefit_name: '수분 보충' },
      { benefit_id: 'BEN016', products_id: 'PROD008', benefit_name: '기호성 향상' }
    ]
  },
  {
    products_id: 'PROD009',
    name: '소고기 츄르',
    brand: '펫밀리',
    category: '간식',
    snack_type: '츄르',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400',
    price: 13000,
    rating: 4.8,
    reviewCount: 387,
    size: '14g x 20개',
    madeIn: '한국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING009', products_id: 'PROD009', ingredients_name: '소' }
    ],
    benefits: [
      { benefit_id: 'BEN017', products_id: 'PROD009', benefit_name: '수분 보충' },
      { benefit_id: 'BEN018', products_id: 'PROD009', benefit_name: '영양 보충' }
    ]
  },

  // 덴탈껌
  {
    products_id: 'PROD010',
    name: '덴탈껌 스틱',
    brand: '네추럴펫',
    category: '간식',
    snack_type: '덴탈껌',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
    price: 15000,
    rating: 4.7,
    reviewCount: 298,
    size: '30개입',
    madeIn: '한국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING010', products_id: 'PROD010', ingredients_name: '닭' },
      { ingredients_id: 'ING011', products_id: 'PROD010', ingredients_name: '쌀' }
    ],
    benefits: [
      { benefit_id: 'BEN019', products_id: 'PROD010', benefit_name: '치아 건강' },
      { benefit_id: 'BEN020', products_id: 'PROD010', benefit_name: '구강 관리' },
      { benefit_id: 'BEN021', products_id: 'PROD010', benefit_name: '스트레스 해소' }
    ]
  },

  // 더미 상품들 (필터링 테스트용)
  {
    products_id: 'PROD011',
    name: '강아지 사료 A',
    brand: '도그푸드',
    category: '사료',
    snack_type: '사료',
    imageUrl: 'https://images.unsplash.com/photo-1588611824626-493d5f69bea0?w=400',
    price: 45000,
    rating: 4.5,
    reviewCount: 156,
    size: '2kg',
    madeIn: '한국',
    ageGroup: ['성견'],
    ingredients: [
      { ingredients_id: 'ING012', products_id: 'PROD011', ingredients_name: '닭' },
      { ingredients_id: 'ING013', products_id: 'PROD011', ingredients_name: '쌀' }
    ],
    benefits: [
      { benefit_id: 'BEN022', products_id: 'PROD011', benefit_name: '영양 균형' }
    ]
  },
  {
    products_id: 'PROD012',
    name: '영양제 멀티비타민',
    brand: '펫밀리',
    category: '영양제',
    snack_type: '영양제',
    imageUrl: 'https://images.unsplash.com/photo-1597933534024-26698747a44b?w=400',
    price: 28000,
    rating: 4.6,
    reviewCount: 89,
    size: '60정',
    madeIn: '미국',
    ageGroup: ['전연령'],
    ingredients: [
      { ingredients_id: 'ING014', products_id: 'PROD012', ingredients_name: '비타민' }
    ],
    benefits: [
      { benefit_id: 'BEN023', products_id: 'PROD012', benefit_name: '면역력 강화' },
      { benefit_id: 'BEN024', products_id: 'PROD012', benefit_name: '영양 보충' }
    ]
  },
];

// ========================================
// Helper Functions
// ========================================

// 카테고리별 상품 가져오기
export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(p => p.category === category);
};

// 간식 타입별 상품 가져오기
export const getProductsBySnackType = (snackType: string): Product[] => {
  return mockProducts.filter(p => p.snack_type === snackType);
};

// 원재료별 상품 가져오기
export const getProductsByIngredient = (ingredientName: string): Product[] => {
  return mockProducts.filter(p => 
    p.ingredients?.some(ing => ing.ingredients_name === ingredientName)
  );
};

// 브랜드별 상품 가져오기
export const getProductsByBrand = (brand: string): Product[] => {
  return mockProducts.filter(p => p.brand === brand);
};

// 상품 ID로 검색
export const getProductById = (productId: string): Product | undefined => {
  return mockProducts.find(p => p.products_id === productId);
};

// 인기 상품 (평점 순)
export const getTrendingProducts = (limit: number = 10): Product[] => {
  return [...mockProducts]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
};

// 신상품 (최신순 - products_id 기준)
export const getNewProducts = (limit: number = 10): Product[] => {
  return [...mockProducts]
    .reverse()
    .slice(0, limit);
};

// 할인 상품
export const getDiscountedProducts = (): Product[] => {
  return mockProducts.filter(p => p.originalPrice && p.originalPrice > (p.price || 0));
};
