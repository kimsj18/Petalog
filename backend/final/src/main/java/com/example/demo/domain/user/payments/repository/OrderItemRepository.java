package com.example.demo.domain.user.payments.repository;

import com.example.demo.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
    
    // 주문별 주문 항목 조회
    List<OrderItem> findByOrders_OrdersId(String ordersId);
}

