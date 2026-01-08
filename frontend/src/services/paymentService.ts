// 포트원 결제 서비스

import { apiClient, ApiResponse } from '@/lib/api';

// 결제 요청 DTO
export interface PaymentRequestDTO {
  type: 'cart' | 'buyNow';
  cartId?: string;
  productId?: string;
  quantity?: number;
  recipientName: string;
  recipientPhone: string;
  zipcode: string;
  address1: string;
  address2?: string;
  paymentMethod: string;
  amount: number;
}

// 결제 응답 DTO
export interface PaymentResponseDTO {
  paymentId: string;
  ordersId?: string;
  orderNumber: string;
  merchantUid: string;
  impUid?: string;
  transactionId?: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt?: string;
  createdAt: string;
}

// 결제 승인 DTO
export interface PortOnePaymentConfirmDTO {
  impUid: string;
  merchantUid: string;
  amount: number;
  // 배송지 정보 추가
  recipientName: string;
  recipientPhone: string;
  zipcode: string;
  address1: string;
  address2?: string;
  // 주문 정보 추가
  type: 'cart' | 'buyNow';
  productId?: string;
  quantity?: number;
}

// ========================================
// Payment API
// ========================================

export const paymentService = {
  /**
   * 결제 요청 생성 (merchant_uid 생성)
   * POST /api/v1/payments/request
   */
  async createPaymentRequest(data: PaymentRequestDTO): Promise<ApiResponse<PaymentResponseDTO>> {
    return apiClient.post<PaymentResponseDTO>('/v1/payments/request', data as unknown as Record<string, unknown>);
  },

  /**
   * 결제 승인 처리
   * POST /api/v1/payments/confirm
   */
  async confirmPayment(data: PortOnePaymentConfirmDTO): Promise<ApiResponse<PaymentResponseDTO>> {
    return apiClient.post<PaymentResponseDTO>('/v1/payments/confirm', data as unknown as Record<string, unknown>);
  },

  /**
   * 결제 취소
   * POST /api/v1/payments/{paymentId}/cancel
   */
  async cancelPayment(
    paymentId: string,
    cancelReason: string,
    cancelAmount?: number
  ): Promise<ApiResponse<PaymentResponseDTO>> {
    return apiClient.post<PaymentResponseDTO>(
      `/v1/payments/${paymentId}/cancel`,
      { cancelReason, cancelAmount }
    );
  },
};

