import { apiClient, ApiResponse } from './api';
import { CartItem } from '../components/CartPage';

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
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.post<Order>('/orders', orderData);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockOrder: Order = {
    id: 'order_' + Date.now(),
    orderNumber: 'ORD' + Date.now().toString().slice(-8),
    userId: 'user_1',
    items: orderData.items,
    shippingAddress: orderData.shippingAddress,
    paymentMethod: orderData.paymentMethod,
    totalAmount: orderData.totalAmount,
    deliveryFee: orderData.deliveryFee,
    finalAmount: orderData.totalAmount + orderData.deliveryFee,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // localStorage에 저장 (Mock)
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(mockOrder);
  localStorage.setItem('orders', JSON.stringify(orders));

  return {
    success: true,
    data: mockOrder,
  };
}

/**
 * 주문 목록 조회
 * GET /orders
 */
export async function getOrders(page: number = 1, limit: number = 10): Promise<ApiResponse<OrderListResponse>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<OrderListResponse>(`/orders?page=${page}&limit=${limit}`);

  // 현재: localStorage에서 조회 (Mock)
  await new Promise(resolve => setTimeout(resolve, 300));

  const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];

  return {
    success: true,
    data: {
      orders,
      total: orders.length,
      page,
      totalPages: Math.ceil(orders.length / limit),
    },
  };
}

/**
 * 주문 상세 조회
 * GET /orders/:id
 */
export async function getOrderById(orderId: string): Promise<ApiResponse<Order>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<Order>(`/orders/${orderId}`);

  // 현재: localStorage에서 조회 (Mock)
  await new Promise(resolve => setTimeout(resolve, 200));

  const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return {
      success: false,
      error: '주문을 찾을 수 없습니다.',
    };
  }

  return {
    success: true,
    data: order,
  };
}

/**
 * 결제 처리
 * POST /payments
 */
export async function processPayment(paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // 실제로는 백엔드에서 토스페이먼츠 API를 호출합니다
  // return await apiClient.post<PaymentResponse>('/payments', paymentData);

  // 현재: Mock 처리 (시뮬레이션)
  await new Promise(resolve => setTimeout(resolve, 2000)); // 결제 처리 시뮬레이션

  const mockPaymentResponse: PaymentResponse = {
    success: true,
    paymentKey: 'mock_payment_key_' + Date.now(),
    orderId: paymentData.orderId,
    transactionId: 'txn_' + Date.now(),
    amount: paymentData.amount,
    paidAt: new Date().toISOString(),
  };

  // 주문 상태 업데이트
  const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
  const orderIndex = orders.findIndex(o => o.id === paymentData.orderId);
  
  if (orderIndex > -1) {
    orders[orderIndex].status = 'paid';
    orders[orderIndex].paymentStatus = 'completed';
    orders[orderIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  return {
    success: true,
    data: mockPaymentResponse,
  };
}

/**
 * 주문 취소
 * POST /orders/:id/cancel
 */
export async function cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<Order>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason });

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 500));

  const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
  const orderIndex = orders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return {
      success: false,
      error: '주문을 찾을 수 없습니다.',
    };
  }

  orders[orderIndex].status = 'cancelled';
  orders[orderIndex].updatedAt = new Date().toISOString();
  localStorage.setItem('orders', JSON.stringify(orders));

  return {
    success: true,
    data: orders[orderIndex],
  };
}

/**
 * 배송 추적
 * GET /orders/:id/tracking
 */
export async function trackOrder(orderId: string): Promise<ApiResponse<any>> {
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // return await apiClient.get<any>(`/orders/${orderId}/tracking`);

  // 현재: Mock 데이터
  await new Promise(resolve => setTimeout(resolve, 300));

  const mockTracking = {
    orderId,
    carrier: 'CJ대한통운',
    trackingNumber: '1234567890123',
    status: 'in_transit',
    estimatedDelivery: '2024-01-20',
    trackingHistory: [
      {
        date: '2024-01-18 09:00',
        status: '배송 출발',
        location: '서울 물류센터',
      },
      {
        date: '2024-01-18 14:00',
        status: '배송 중',
        location: '경기 분당',
      },
    ],
  };

  return {
    success: true,
    data: mockTracking,
  };
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
  // TODO: 실제 API 연결 시 아래 코드 주석 해제
  // 백엔드에서 토스페이먼츠 API를 호출하여 결제를 승인합니다
  // return await apiClient.post<PaymentResponse>('/payments/toss/confirm', data);

  // 현재: Mock 처리
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    data: {
      success: true,
      paymentKey: data.paymentKey,
      orderId: data.orderId,
      transactionId: 'txn_' + Date.now(),
      amount: data.amount,
      paidAt: new Date().toISOString(),
    },
  };
}
