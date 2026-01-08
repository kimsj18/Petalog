package com.example.demo.domain.user.orders.service;

import com.example.demo.domain.user.orders.DTO.OrderDTO;
import com.example.demo.entity.Orders;

import java.util.List;

public interface OrdersService {

    List<OrderDTO> findByUser_userId(String userId);
}
