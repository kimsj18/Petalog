package com.example.demo.domain.user.payments.DTO;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    
    // 결제 타입
    private String type;  // "cart" or "buyNow"
    
    // 장바구니 결제용
    private String cartId;  // 장바구니에서 결제할 때
    
    // 바로구매용
    private String productId;  // 바로구매할 때
    private Integer quantity;  // 바로구매할 때
    
    // 배송지 정보
    private String recipientName;
    private String recipientPhone;
    private String zipcode;
    private String address1;
    private String address2;
    
    // 결제 정보
    private String paymentMethod;  // "TOSS"
    private int amount;
}

