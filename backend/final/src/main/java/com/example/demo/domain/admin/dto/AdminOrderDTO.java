package com.example.demo.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminOrderDTO {
    private String orderId;
    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private int totalAmount;
    private int deliveryAmount;
    private int finalAmount;
    private String orderStatus;
    private LocalDateTime orderDate;
    private int itemCount;
}

