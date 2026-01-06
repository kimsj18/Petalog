import { ApiResponse, apiClient } from './api';

// ==================== 타입 정의 ====================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  images?: string[];
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  content: string;
  images?: string[];
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ==================== API 함수 ====================

/**
 * 상품 리뷰 목록 조회
 * GET /products/:productId/reviews
 */
export async function getProductReviews(productId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<ReviewListResponse>> {
  return await apiClient.get<ReviewListResponse>(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
}

/**
 * 리뷰 작성
 * POST /reviews
 */
export async function createReview(reviewData: CreateReviewRequest): Promise<ApiResponse<Review>> {
  return await apiClient.post<Review>('/reviews', reviewData as unknown as Record<string, unknown>);
}

/**
 * 리뷰 수정
 * PUT /reviews/:id
 */
export async function updateReview(reviewId: string, reviewData: Partial<CreateReviewRequest>): Promise<ApiResponse<Review>> {
  return await apiClient.put<Review>(`/reviews/${reviewId}`, reviewData as unknown as Record<string, unknown>);
}

/**
 * 리뷰 삭제
 * DELETE /reviews/:id
 */
export async function deleteReview(reviewId: string): Promise<ApiResponse<void>> {
  return await apiClient.delete<void>(`/reviews/${reviewId}`);
}

/**
 * 리뷰 도움됨 표시
 * POST /reviews/:id/helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<ApiResponse<void>> {
  return await apiClient.post<void>(`/reviews/${reviewId}/helpful`);
}
