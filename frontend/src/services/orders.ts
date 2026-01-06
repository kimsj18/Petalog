import { ApiResponse, apiClient } from './api';
import { CartItem } from '../types';

// ==================== 타입 정의 ====================

export interface ShippingAddress {
  name: string;
  phone: string;
  zipCode: string;
  address: string;
  detailAddress: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string; // 'card' | 'bank' | 'toss' 등
  totalAmount: number;
  deliveryFee: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  deliveryFee: number;
  finalAmount: number;
  status: 'pending' | 'paid' | 'preparing' | 'shipping' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PaymentRequest {
  orderId: string;
  paymentMethod: string;
  amount: number;
  // 토스페이먼츠 관련 정보
  tossPaymentKey?: string;
  tossOrderId?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentKey: string;
  orderId: string;
  transactionId: string;
  amount: number;
  paidAt: string;
}

// ==================== API 함수 ====================

/**
 * 주문 생성
 * POST /orders
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
  return await apiClient.post<Order>('/orders', orderData );
}

/**
 * 주문 목록 조회
 * GET /orders
 */
export async function getOrders(page: number = 1, limit: number = 10): Promise<ApiResponse<OrderListResponse>> {
  return await apiClient.get<OrderListResponse>(`/orders?page=${page}&limit=${limit}`);
}

/**
 * 주문 상세 조회
 * GET /orders/:id
 */
export async function getOrderById(orderId: string): Promise<ApiResponse<Order>> {
  return await apiClient.get<Order>(`/orders/${orderId}`);
}

/**
 * 결제 처리
 * POST /payments
 */
export async function processPayment(paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
  return await apiClient.post<PaymentResponse>('/payments', paymentData );
}

/**
 * 주문 취소
 * POST /orders/:id/cancel
 */
export async function cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<Order>> {
  return await apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason });
}

/**
 * 배송 추적
 * GET /orders/:id/tracking
 */
export async function trackOrder(orderId: string): Promise<ApiResponse<{
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  trackingHistory: Array<{
    date: string;
    status: string;
    location: string;
  }>;
}>> {
  return await apiClient.get(`/orders/${orderId}/tracking`);
}

/**
 * 토스페이먼츠 결제 승인 (서버에서 처리)
 * POST /payments/toss/confirm
 */
export async function confirmTossPayment(data: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<ApiResponse<PaymentResponse>> {
  return await apiClient.post<PaymentResponse>('/payments/toss/confirm', data);
}
