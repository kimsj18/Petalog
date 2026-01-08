package com.example.demo.domain.user.orders.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {
    private String orderId;
    private String name;
    private String phone;
    private String zipcode;
    private String address1;
    private String address2;
    private String orderNumber;
    private int totalAmount;
    private int deliveryAmount;
    private int finalAmount;
    private String orderStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
}
