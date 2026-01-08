'use client';

import React, { useState, useEffect } from 'react';
import { orderService, OrderDTO, OrderItemDTO } from '@/services/orderService';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Container } from './common/Container';
import { useRouter } from 'next/navigation';

export function OrderHistory() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getUserOrders();
      
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError(response.error || '주문 내역을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('주문 내역을 불러오는 중 오류가 발생했습니다.');
      console.error('주문 내역 조회 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
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
    } catch (err) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const handleOrderClick = async (order: OrderDTO) => {
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

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <div className="text-center">주문 내역을 불러오는 중...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-500">{error}</div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">주문 내역</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                주문 내역이 없습니다.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>상품금액</TableHead>
                    <TableHead>배송비</TableHead>
                    <TableHead>최종금액</TableHead>
                    <TableHead>주문일시</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow 
                      key={order.orderId}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleOrderClick(order)}
                    >
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(order.totalAmount)}원
                      </TableCell>
                      <TableCell>
                        {formatCurrency(order.deliveryAmount)}원
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(order.finalAmount)}원
                      </TableCell>
                      <TableCell>
                        {formatDate(order.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 주문 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
          ) : orderItems.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              주문 상세 정보가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {selectedOrder && (
                <div className="border-b pb-4 space-y-2">
                  <h3 className="font-semibold text-lg">주문 정보</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">수령인:</span> {selectedOrder.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">연락처:</span> {selectedOrder.phone}
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">주소:</span> ({selectedOrder.zipcode}) {selectedOrder.address1} {selectedOrder.address2}
                    </div>
                    <div>
                      <span className="text-muted-foreground">주문 상태:</span> {selectedOrder.orderStatus}
                    </div>
                    <div>
                      <span className="text-muted-foreground">주문일시:</span> {formatDate(selectedOrder.createdAt)}
                    </div>
                  </div>
                </div>
              )}
              
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
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/products/${item.productsId}`)}
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

              {selectedOrder && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">상품금액:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">배송비:</span>
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
    </Container>
  );
}
