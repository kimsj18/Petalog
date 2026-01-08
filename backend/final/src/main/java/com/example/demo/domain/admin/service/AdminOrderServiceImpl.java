package com.example.demo.domain.admin.service;

import com.example.demo.domain.admin.dto.AdminOrderDTO;
import com.example.demo.domain.user.orders.repository.OrdersRepository;
import com.example.demo.domain.user.payments.repository.OrderItemRepository;
import com.example.demo.entity.Orders;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminOrderServiceImpl implements AdminOrderService {

    private final OrdersRepository ordersRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public List<AdminOrderDTO> findAllOrders() {
        List<Orders> orders = ordersRepository.findAll();
        
        return orders.stream()
                .map(order -> {
                    // 주문 아이템 수 조회
                    int itemCount = orderItemRepository.findByOrders_OrdersId(order.getOrdersId()).size();
                    
                    return AdminOrderDTO.builder()
                            .orderId(order.getOrdersId())
                            .orderNumber(order.getOrderNumber())
                            .customerName(order.getRecipientName())
                            .customerEmail(order.getUser() != null ? order.getUser().getUserEmail() : "")
                            .totalAmount(order.getTotalAmount())
                            .deliveryAmount(order.getDeliveryFee())
                            .finalAmount(order.getFinalAmount())
                            .orderStatus(order.getOrderStatus())
                            .orderDate(order.getCreatedAt())
                            .itemCount(itemCount)
                            .build();
                })
                .toList();
    }
}

