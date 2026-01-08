// Spring Boot API - 주문 서비스

import { apiClient, ApiResponse } from '@/lib/api';
import { Order } from '@/types';

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

// 주문 내역 DTO (백엔드 OrderDTO와 매핑)
export interface OrderDTO {
  orderId: string;
  name: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
  orderNumber: string;
  totalAmount: number;
  deliveryAmount: number;
  finalAmount: number;
  orderStatus: string;
  createdAt: string;
  updateAt: string;
}

// 주문 아이템 DTO (백엔드 OrderItemDTO와 매핑)
export interface OrderItemDTO {
  orderItemId: string;
  productsId: string;
  name: string;
  quantity: number;
  price: number;
  brand: string;
  madein: string;
  category: string;
}

// 관리자 주문 DTO (백엔드 AdminOrderDTO와 매핑)
export interface AdminOrderDTO {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  deliveryAmount: number;
  finalAmount: number;
  orderStatus: string;
  orderDate: string;
  itemCount: number;
}

export interface AdminDashboardDTO{
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

// ========================================
// Orders API
// ========================================

export const orderService = {
  /**
   * 사용자 주문 내역 조회
   * GET /api/v1/user/orders
   */
  async getUserOrders(): Promise<ApiResponse<OrderDTO[]>> {
    return apiClient.get<OrderDTO[]>('/v1/user/orders');
  },

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
    return apiClient.post<{ orders_id: string }>('/orders', data as unknown as Record<string, unknown>);
  },

  /**
   * 주문 취소
   * DELETE /orders/{id}
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/orders/${orderId}`);
  },

  /**
   * 주문 상세 아이템 조회
   * GET /api/v1/user/orders/detail?orderId={orderId}
   */
  async getOrderItems(orderId: string): Promise<ApiResponse<OrderItemDTO[]>> {
    return apiClient.get<OrderItemDTO[]>('/v1/user/orders/detail', { orderId });
  },

  /**
   * 관리자 주문 목록 조회
   * GET /api/v1/admin/orders
   */
  async getAdminOrders(): Promise<ApiResponse<AdminOrderDTO[]>> {
    return apiClient.get<AdminOrderDTO[]>('/v1/admin/orders');
  },


  /**
   * 관리자 대쉬보드 조회
   * GET /api/v1/admin/dashboard
   */
  async getAdminDashboard(): Promise<ApiResponse<AdminDashboardDTO>>{
    return apiClient.get<AdminDashboardDTO>('/v1/admin/dashboard');
  }
};
