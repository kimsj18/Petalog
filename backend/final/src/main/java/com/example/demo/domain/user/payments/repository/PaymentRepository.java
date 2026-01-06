package com.example.demo.domain.user.payments.repository;

import com.example.demo.entity.payments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<payments, String> {
    
    // merchant_uid로 결제 조회
    Optional<payments> findByMerchantUid(String merchantUid);
    
    // imp_uid로 결제 조회
    Optional<payments> findByImpUid(String impUid);
    
    // order_id로 결제 조회
    Optional<payments> findByOrders_OrdersId(String ordersId);
}

