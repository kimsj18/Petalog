package com.example.demo.domain.admin.controller;

import com.example.demo.domain.admin.dto.AdminOrderDTO;
import com.example.demo.domain.admin.service.AdminOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @GetMapping("/orders")
    public List<AdminOrderDTO> getAllOrders() {
        return adminOrderService.findAllOrders();
    }
}

