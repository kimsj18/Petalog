import { ApiResponse, apiClient } from './api';
import { Product } from '../types';

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
  const params = new URLSearchParams();
  if (filter?.priceRange) {
    params.append('minPrice', filter.priceRange[0].toString());
    params.append('maxPrice', filter.priceRange[1].toString());
  }
  if (filter?.ageGroup) params.append('ageGroup', filter.ageGroup.join(','));
  if (filter?.benefits) params.append('benefits', filter.benefits.join(','));
  if (filter?.brands) params.append('brands', filter.brands.join(','));
  if (filter?.category) params.append('category', filter.category);
  if (filter?.mainIngredient) params.append('mainIngredient', filter.mainIngredient);
  if (filter?.search) params.append('search', filter.search);
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.limit) params.append('limit', filter.limit.toString());
  
  return await apiClient.get<ProductListResponse>(`/products?${params.toString()}`);
}

/**
 * 상품 상세 조회
 * GET /v1/user/productDetail?productId={id}
 */
export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  return await apiClient.get<Product>(`/v1/user/productDetail?productId=${id}`);
}

/**
 * 인기 상품 조회
 * GET /products/trending
 */
export async function getTrendingProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
  return await apiClient.get<Product[]>(`/products/trending?limit=${limit}`);
}

/**
 * 카테고리별 상품 조회
 * GET /products/category/:category
 */
export async function getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
  return await apiClient.get<Product[]>(`/products/category/${category}`);
}

/**
 * 원재료별 상품 조회
 * GET /products/ingredient/:ingredient
 */
export async function getProductsByIngredient(ingredient: string): Promise<ApiResponse<Product[]>> {
  return await apiClient.get<Product[]>(`/products/ingredient/${ingredient}`);
}

/**
 * 상품 생성 (관리자 전용)
 * POST /products
 */
export async function createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
  return await apiClient.post<Product>('/products', productData );
}

/**
 * 상품 수정 (관리자 전용)
 * PUT /products/:id
 */
export async function updateProduct(id: string, productData: Partial<CreateProductRequest>): Promise<ApiResponse<Product>> {
  return await apiClient.put<Product>(`/products/${id}`, productData );
}

/**
 * 상품 삭제 (관리자 전용)
 * DELETE /products/:id
 */
export async function deleteProduct(id: string): Promise<ApiResponse<void>> {
  return await apiClient.delete<void>(`/products/${id}`);
}

/**
 * 상품 검색
 * GET /products/search
 */
export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  return await apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
}
