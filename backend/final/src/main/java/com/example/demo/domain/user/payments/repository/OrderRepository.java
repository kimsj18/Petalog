package com.example.demo.domain.user.payments.repository;

import com.example.demo.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Orders, String> {
    
    // 사용자별 주문 목록 조회
    List<Orders> findByUser_UserIdOrderByCreatedAtDesc(String userId);
    
    // 주문번호로 조회
    Optional<Orders> findByOrderNumber(String orderNumber);
}

