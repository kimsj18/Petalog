'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Package } from 'lucide-react';
import { orderService, AdminOrderDTO, OrderItemDTO } from '@/services/orderService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export function AdminOrderList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<AdminOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDTO | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getAdminOrders();
      
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError(response.error || '주문 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('주문 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('주문 목록 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleViewOrder = async (order: AdminOrderDTO) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setItemsLoading(true);
    setItemsError(null);
    setOrderItems([]);

    try {
      const response = await orderService.getOrderItems(order.orderId);
      
      if (response.success && response.data) {
        setOrderItems(response.data);
      } else {
        setItemsError(response.error || '주문 상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setItemsError('주문 상세 정보를 불러오는 중 오류가 발생했습니다.');
      console.error('주문 상세 조회 오류:', err);
    } finally {
      setItemsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setOrderItems([]);
    setItemsError(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '결제 대기',
      processing: '처리 중',
      shipped: '배송 중',
      delivered: '배송 완료',
      cancelled: '취소됨',
      PENDING: '결제 대기',
      PROCESSING: '처리 중',
      SHIPPED: '배송 중',
      DELIVERED: '배송 완료',
      CANCELLED: '취소됨',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || colorMap[statusUpper] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesStatus = statusFilter === 'all' || 
        order.orderStatus.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

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

      {/* 로딩 및 에러 상태 */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-gray-500">주문 목록을 불러오는 중...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      )}

      {!loading && !error && (
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
                  {/* <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                    작업
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr 
                    key={order.orderId} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewOrder(order)}
                  >
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
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {getStatusText(order.orderStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.orderDate)}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleViewOrder(order.orderId)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="size-5 inline" />
                      </button>
                    </td> */}
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
      )}

      {/* 주문 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>주문 상세</DialogTitle>
            <DialogDescription>
              {selectedOrder && `주문번호: ${selectedOrder.orderNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          {itemsLoading ? (
            <div className="py-8 text-center">주문 상세 정보를 불러오는 중...</div>
          ) : itemsError ? (
            <div className="py-8 text-center text-red-500">{itemsError}</div>
          ) : (
            <div className="space-y-4">
              {selectedOrder && (
                <div className="border-b pb-4 space-y-2">
                  <h3 className="font-semibold text-lg">주문 정보</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">고객명:</span> {selectedOrder.customerName}
                    </div>
                    <div>
                      <span className="text-gray-500">이메일:</span> {selectedOrder.customerEmail}
                    </div>
                    <div>
                      <span className="text-gray-500">주문 상태:</span> {getStatusText(selectedOrder.orderStatus)}
                    </div>
                    <div>
                      <span className="text-gray-500">주문일시:</span> {formatDateTime(selectedOrder.orderDate)}
                    </div>
                    <div>
                      <span className="text-gray-500">상품 수:</span> {selectedOrder.itemCount}개
                    </div>
                  </div>
                </div>
              )}
              
              {orderItems.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">주문 상품</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>상품명</TableHead>
                        <TableHead>브랜드</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>제조국</TableHead>
                        <TableHead className="text-right">수량</TableHead>
                        <TableHead className="text-right">단가</TableHead>
                        <TableHead className="text-right">금액</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow 
                          key={item.orderItemId}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.brand}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.madein}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}원</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(item.price * item.quantity)}원
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedOrder && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">상품금액:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">배송비:</span>
                    <span>{formatCurrency(selectedOrder.deliveryAmount)}원</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>최종금액:</span>
                    <span>{formatCurrency(selectedOrder.finalAmount)}원</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
