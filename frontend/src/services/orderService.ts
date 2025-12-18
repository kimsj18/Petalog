// Spring Boot API - 주문 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { Order, OrderItem } from '@/types';

// 주문 생성 요청
export interface CreateOrderRequest {
  recipient_name: string;
  recipient_phone: string;
  zipcode: string;
  address1: string;
  address2?: string;
  items: {
    products_id: string;
    quantity: number;
    price: number;
  }[];
}

// ========================================
// Orders API
// ========================================

export const orderService = {
  /**
   * 주문 목록 조회
   * GET /orders
   */
  async getOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>('/orders');
  },

  /**
   * 주문 상세 조회
   * GET /orders/{id}
   */
  async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  /**
   * 주문 생성
   * POST /orders
   */
  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<{ orders_id: string }>> {
    return apiClient.post<{ orders_id: string }>('/orders', data);
  },

  /**
   * 주문 취소
   * DELETE /orders/{id}
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/orders/${orderId}`);
  },
};
