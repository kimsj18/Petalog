package com.example.demo.domain.user.payments.repository;

import com.example.demo.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
    
    // 주문별 주문 항목 조회
    List<OrderItem> findByOrders_OrdersId(String ordersId);

    @Query("""
    select oi
    from OrderItem oi
    join fetch oi.products
    join oi.orders o
    where o.ordersId = :orderId
""")
    List<OrderItem> findWithProductsByOrderId(String  orderId);

    @Query("""
    SELECT oi.products.productsId, SUM(oi.quantity) as totalQuantity
    FROM OrderItem oi
    GROUP BY oi.products.productsId
    ORDER BY totalQuantity DESC
""")
    List<Object[]> findTopProductsByOrderQuantity();

}

