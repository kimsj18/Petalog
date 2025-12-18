import { apiClient, ApiResponse } from './api';

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
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<ReviewListResponse>(`/products/${productId}/reviews?page=${page}&limit=${limit}`);

  // 현재: Mock 데이터 반환
  await new Promise(resolve => setTimeout(resolve, 300));

  const mockReviews: Review[] = [
    {
      id: '1',
      productId,
      userId: 'user_1',
      userName: '김**',
      rating: 5,
      content: '우리 강아지가 너무 좋아해요! 소화도 잘 되고 알러지도 없어요.',
      helpful: 24,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      productId,
      userId: 'user_2',
      userName: '이**',
      rating: 4,
      content: '가격 대비 품질이 좋습니다. 재구매 의사 있어요.',
      helpful: 12,
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
    },
  ];

  return {
    success: true,
    data: {
      reviews: mockReviews,
      total: mockReviews.length,
      averageRating: 4.5,
      ratingDistribution: {
        5: 150,
        4: 50,
        3: 20,
        2: 10,
        1: 4,
      },
    },
  };
}

/**
 * 리뷰 작성
 * POST /reviews
 */
export async function createReview(reviewData: CreateReviewRequest): Promise<ApiResponse<Review>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.post<Review>('/reviews', reviewData);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 500));

  const newReview: Review = {
    id: 'review_' + Date.now(),
    productId: reviewData.productId,
    userId: 'user_1',
    userName: '사용자',
    rating: reviewData.rating,
    content: reviewData.content,
    images: reviewData.images,
    helpful: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    data: newReview,
  };
}

/**
 * 리뷰 수정
 * PUT /reviews/:id
 */
export async function updateReview(reviewId: string, reviewData: Partial<CreateReviewRequest>): Promise<ApiResponse<Review>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.put<Review>(`/reviews/${reviewId}`, reviewData);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    data: {
      id: reviewId,
      ...reviewData,
      updatedAt: new Date().toISOString(),
    } as Review,
  };
}

/**
 * 리뷰 삭제
 * DELETE /reviews/:id
 */
export async function deleteReview(reviewId: string): Promise<ApiResponse<void>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.delete<void>(`/reviews/${reviewId}`);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
  };
}

/**
 * 리뷰 도움됨 표시
 * POST /reviews/:id/helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<ApiResponse<void>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.post<void>(`/reviews/${reviewId}/helpful`);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    success: true,
  };
}
