// Spring Boot API - 리뷰 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { Review } from '@/types';

// 리뷰 작성 요청
export interface CreateReviewRequest {
  products_id: string;
  title: string;
  content: string;
  score: number; // 1-5
}

// 리뷰 수정 요청
export interface UpdateReviewRequest {
  title?: string;
  content?: string;
  score?: number;
}

// ========================================
// Reviews API
// ========================================

export const reviewService = {
  /**
   * 리뷰 목록 조회
   * GET /reviews
   */
  async getReviews(params?: { products_id?: string; user_id?: string }): Promise<ApiResponse<Review[]>> {
    return apiClient.get<Review[]>('/reviews', params);
  },

  /**
   * 상품별 리뷰 조회
   * GET /reviews?products_id=PROD001
   */
  async getReviewsByProduct(productId: string): Promise<ApiResponse<Review[]>> {
    return apiClient.get<Review[]>('/reviews', { products_id: productId });
  },

  /**
   * 내 리뷰 조회
   * GET /reviews/my
   */
  async getMyReviews(): Promise<ApiResponse<Review[]>> {
    return apiClient.get<Review[]>('/reviews/my');
  },

  /**
   * 리뷰 작성
   * POST /reviews
   */
  async createReview(data: CreateReviewRequest): Promise<ApiResponse<{ id: string }>> {
    return apiClient.post<{ id: string }>('/reviews', data);
  },

  /**
   * 리뷰 수정
   * PUT /reviews/{id}
   */
  async updateReview(reviewId: string, data: UpdateReviewRequest): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`/reviews/${reviewId}`, data);
  },

  /**
   * 리뷰 삭제
   * DELETE /reviews/{id}
   */
  async deleteReview(reviewId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/reviews/${reviewId}`);
  },
};
