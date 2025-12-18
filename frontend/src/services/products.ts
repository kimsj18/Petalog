import { apiClient, ApiResponse } from './api';
import { Product } from '../App';

// ==================== 타입 정의 ====================

export interface ProductFilter {
  priceRange?: [number, number];
  ageGroup?: string[];
  benefits?: string[];
  brands?: string[];
  category?: string; // 'treat' | 'churu' | 'dental' 등
  mainIngredient?: string; // 'chicken' | 'beef' | 'pork' 등
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateProductRequest {
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  ingredients: string[];
  benefits: string[];
  ageGroup: string[];
  size: string;
  madeIn: string;
  bestFor: string[];
  category?: string;
  mainIngredient?: string;
  stock?: number;
}

// ==================== API 함수 ====================

/**
 * 전체 상품 목록 조회 (필터링 포함)
 * GET /products
 */
export async function getProducts(filter?: ProductFilter): Promise<ApiResponse<ProductListResponse>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // const params = new URLSearchParams();
  // if (filter?.priceRange) params.append('minPrice', filter.priceRange[0].toString());
  // if (filter?.priceRange) params.append('maxPrice', filter.priceRange[1].toString());
  // if (filter?.ageGroup) params.append('ageGroup', filter.ageGroup.join(','));
  // if (filter?.benefits) params.append('benefits', filter.benefits.join(','));
  // if (filter?.brands) params.append('brands', filter.brands.join(','));
  // if (filter?.category) params.append('category', filter.category);
  // if (filter?.mainIngredient) params.append('mainIngredient', filter.mainIngredient);
  // if (filter?.search) params.append('search', filter.search);
  // if (filter?.page) params.append('page', filter.page.toString());
  // if (filter?.limit) params.append('limit', filter.limit.toString());
  // 
  // return await apiClient.get<ProductListResponse>(`/products?${params.toString()}`);

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 300));

  const mockProducts: Product[] = [
    {
      id: '1',
      name: '건강한 닭고기 트릿',
      brand: '해피독',
      price: 15000,
      originalPrice: 18000,
      rating: 4.5,
      reviewCount: 234,
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
      ingredients: ['닭고기', '고구마', '블루베리'],
      benefits: ['관절 건강', '면역력 강화'],
      ageGroup: ['퍼피', '어덜트'],
      size: '200g',
      madeIn: '한국',
      bestFor: ['소형견', '중형견'],
    },
    // 더 많은 mock 데이터 추가 가능
  ];

  return {
    success: true,
    data: {
      products: mockProducts,
      total: mockProducts.length,
      page: 1,
      totalPages: 1,
    },
  };
}

/**
 * 상품 상세 조회
 * GET /products/:id
 */
export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<Product>(`/products/${id}`);

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 200));

  const mockProduct: Product = {
    id,
    name: '건강한 닭고기 트릿',
    brand: '해피독',
    price: 15000,
    originalPrice: 18000,
    rating: 4.5,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    ingredients: ['닭고기', '고구마', '블루베리'],
    benefits: ['관절 건강', '면역력 강화'],
    ageGroup: ['퍼피', '어덜트'],
    size: '200g',
    madeIn: '한국',
    bestFor: ['소형견', '중형견'],
  };

  return {
    success: true,
    data: mockProduct,
  };
}

/**
 * 인기 상품 조회
 * GET /products/trending
 */
export async function getTrendingProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<Product[]>(`/products/trending?limit=${limit}`);

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 200));

  const mockProducts: Product[] = [
    // Mock 데이터...
  ];

  return {
    success: true,
    data: mockProducts,
  };
}

/**
 * 카테고리별 상품 조회
 * GET /products/category/:category
 */
export async function getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<Product[]>(`/products/category/${category}`);

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    success: true,
    data: [],
  };
}

/**
 * 원재료별 상품 조회
 * GET /products/ingredient/:ingredient
 */
export async function getProductsByIngredient(ingredient: string): Promise<ApiResponse<Product[]>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<Product[]>(`/products/ingredient/${ingredient}`);

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    success: true,
    data: [],
  };
}

/**
 * 상품 생성 (관리자 전용)
 * POST /products
 */
export async function createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.post<Product>('/products', productData);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 500));

  const newProduct: Product = {
    id: 'new_' + Date.now(),
    ...productData,
    rating: 0,
    reviewCount: 0,
  };

  return {
    success: true,
    data: newProduct,
  };
}

/**
 * 상품 수정 (관리자 전용)
 * PUT /products/:id
 */
export async function updateProduct(id: string, productData: Partial<CreateProductRequest>): Promise<ApiResponse<Product>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.put<Product>(`/products/${id}`, productData);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    data: {
      id,
      ...productData,
    } as Product,
  };
}

/**
 * 상품 삭제 (관리자 전용)
 * DELETE /products/:id
 */
export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.delete<void>(`/products/${id}`);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
  };
}

/**
 * 상품 검색
 * GET /products/search
 */
export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    data: [],
  };
}
