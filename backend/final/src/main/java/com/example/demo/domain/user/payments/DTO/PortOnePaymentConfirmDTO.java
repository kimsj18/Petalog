package com.example.demo.domain.user.payments.DTO;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PortOnePaymentConfirmDTO {
    private String impUid;  // 포트원 결제 고유번호 (paymentId)
    private String merchantUid;  // 주문번호 (orderId)
    private int amount;  // 결제 금액
}

