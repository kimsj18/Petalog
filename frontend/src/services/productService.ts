// Spring Boot API - 상품 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { Product } from '@/types';

// 상품 필터 파라미터
export interface ProductFilterParams {
  category?: string;
  snack_type?: string;
  brand?: string;
  ingredient?: string;
  limit?: number;
  offset?: number;
}

// 상품 등록 요청
export interface CreateProductRequest {
  name: string;
  brand: string;
  category: string;
  snack_type: string;
  imageUrl: string;
  price?: number;
  originalPrice?: number;
  size?: string;
  madeIn?: string;
  ingredients?: string[]; // ['닭', '소']
  benefits?: string[]; // ['면역력 강화', '피부 개선']
}

// 상품 수정 요청
export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// ========================================
// Products API
// ========================================

export const productService = {
  /**
   * 상품 목록 조회
   * GET /products
   */
  async getProducts(params?: ProductFilterParams): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products', params);
  },

  /**
   * 상품 상세 조회
   * GET /products/{id}
   */
  async getProductById(productId: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/${productId}`);
  },

  /**
   * 카테고리별 상품 조회
   * GET /products?category=간식
   */
  async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products', { category });
  },

  /**
   * 간식 타입별 상품 조회
   * GET /products?snack_type=트릿
   */
  async getProductsBySnackType(snackType: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products', { snack_type: snackType });
  },

  /**
   * 원재료별 상품 조회 (알러지 필터)
   * GET /products?ingredient=닭
   */
  async getProductsByIngredient(ingredient: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products', { ingredient });
  },

  /**
   * 브랜드별 상품 조회
   * GET /products?brand=펫밀리
   */
  async getProductsByBrand(brand: string): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products', { brand });
  },

  /**
   * 인기 상품 조회 (평점 순)
   * GET /products/trending
   */
  async getTrendingProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products/trending', { limit });
  },

  /**
   * 신상품 조회
   * GET /products/new
   */
  async getNewProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products/new', { limit });
  },

  /**
   * 할인 상품 조회
   * GET /products/discounted
   */
  async getDiscountedProducts(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products/discounted');
  },

  /**
   * 상품 등록 (관리자)
   * POST /products
   */
  async createProduct(data: CreateProductRequest): Promise<ApiResponse<{ products_id: string }>> {
    return apiClient.post<{ products_id: string }>('/products', data);
  },

  /**
   * 상품 수정 (관리자)
   * PUT /products/{id}
   */
  async updateProduct(productId: string, data: UpdateProductRequest): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`/products/${productId}`, data);
  },

  /**
   * 상품 삭제 (관리자)
   * DELETE /products/{id}
   */
  async deleteProduct(productId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/${productId}`);
  },
};
