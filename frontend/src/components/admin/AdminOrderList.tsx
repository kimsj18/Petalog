'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Eye, Package } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  itemCount: number;
}

export function AdminOrderList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // TODO: API 호출로 변경
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      orderNumber: '20240115-001',
      customerName: '홍길동',
      customerEmail: 'hong@example.com',
      totalAmount: 45000,
      status: 'delivered',
      orderDate: '2024-01-15',
      itemCount: 3,
    },
    {
      id: 'ORD002',
      orderNumber: '20240115-002',
      customerName: '김철수',
      customerEmail: 'kim@example.com',
      totalAmount: 28000,
      status: 'shipped',
      orderDate: '2024-01-15',
      itemCount: 2,
    },
    {
      id: 'ORD003',
      orderNumber: '20240114-001',
      customerName: '이영희',
      customerEmail: 'lee@example.com',
      totalAmount: 15000,
      status: 'processing',
      orderDate: '2024-01-14',
      itemCount: 1,
    },
    {
      id: 'ORD004',
      orderNumber: '20240114-002',
      customerName: '박민수',
      customerEmail: 'park@example.com',
      totalAmount: 52000,
      status: 'pending',
      orderDate: '2024-01-14',
      itemCount: 4,
    },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleViewOrder = (id: string) => {
    // TODO: 주문 상세 페이지
    alert(`주문 상세 보기: ${id}`);
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '결제 대기',
      processing: '처리 중',
      shipped: '배송 중',
      delivered: '배송 완료',
      cancelled: '취소됨',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = orders
    .filter(order => 
      (statusFilter === 'all' || order.status === statusFilter) &&
      (order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={handleBack} className="text-gray-700 hover:text-gray-900">
              <ArrowLeft className="size-6" />
            </button>
            <h1 className="text-2xl text-gray-900">주문 관리</h1>
          </div>

          <div className="flex gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="주문번호, 고객명, 이메일 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 상태 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">전체 상태</option>
              <option value="pending">결제 대기</option>
              <option value="processing">처리 중</option>
              <option value="shipped">배송 중</option>
              <option value="delivered">배송 완료</option>
              <option value="cancelled">취소됨</option>
            </select>
          </div>
        </div>
      </div>

      {/* 주문 테이블 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    주문번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    고객명
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    상품 수
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    총 금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    주문일
                  </th>
                  <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.itemCount}개</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.totalAmount.toLocaleString()}원
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{order.orderDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="size-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="size-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
