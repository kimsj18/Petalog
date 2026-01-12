'use client';

import React, { useState, useEffect } from 'react';
import { orderService, OrderDTO } from '@/services/orderService';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/table';
import { Container } from './common/Container';

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
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
                    <TableRow key={order.orderId}>
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
    </Container>
  );
}
