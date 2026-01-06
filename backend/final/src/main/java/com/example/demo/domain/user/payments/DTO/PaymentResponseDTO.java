package com.example.demo.domain.user.payments.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    private String paymentId;
    private String ordersId;  // 결제 완료 후 생성된 주문 ID
    private String orderNumber;  // 사용자에게 보여줄 주문번호
    private String merchantUid;  // 포트원 주문번호 (merchant_uid)
    private String impUid;  // 포트원 결제 고유번호 (imp_uid)
    private String transactionId;  // 거래 ID
    private int amount;
    private String paymentMethod;
    private String paymentStatus;  // "PENDING", "COMPLETED", "FAILED", "CANCELLED", "REFUNDED"
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}

