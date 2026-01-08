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
    
    // 배송지 정보
    private String recipientName;
    private String recipientPhone;
    private String zipcode;
    private String address1;
    private String address2;
    
    // 주문 정보
    private String type;  // "cart" or "buyNow"
    private String productId;  // 바로구매용
    private Integer quantity;  // 바로구매용
}

