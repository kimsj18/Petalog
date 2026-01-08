package com.example.demo.domain.admin.service;

import com.example.demo.domain.admin.dto.AdminOrderDTO;

import java.util.List;

public interface AdminOrderService {
    List<AdminOrderDTO> findAllOrders();
}

