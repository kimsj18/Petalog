package com.example.demo.domain.user.orderItem.service;

import com.example.demo.domain.user.orderItem.DTO.OrderItemDTO;
import com.example.demo.entity.OrderItem;

import java.util.List;

public interface OrderItemService {

    List<OrderItemDTO> findWithProductsByOrderId(String orderId);
}
