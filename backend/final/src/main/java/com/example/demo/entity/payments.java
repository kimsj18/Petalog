package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class payments {

    @Id
    @Column(name = "payment_id", nullable = false)
    private String paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = true)
    private Orders orders;  // 결제 완료 후 연결 (nullable)

    @Column(name = "imp_uid")
    private String impUid;  // 포트원 결제 고유번호 (imp_uid) (nullable)

    @Column(name = "merchant_uid", nullable = false)
    private String merchantUid;  // 포트원 주문번호 (merchant_uid)

    @Column(name = "transaction_id")
    private String transactionId;  // 결제 승인 후 받음 (nullable)

    @Column(name = "amount", nullable = false)
    private int amount;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;  // "TOSS", "CARD" 등

    @Column(name = "payment_status", nullable = false)
    private String paymentStatus;  // "PENDING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"
}
