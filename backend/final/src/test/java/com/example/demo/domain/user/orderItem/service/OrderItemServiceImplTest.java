package com.example.demo.domain.user.orderItem.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderItemServiceImplTest {

    @Autowired
    private OrderItemService orderItemService;

    @Test
    void findWithProductsByOrderId(){
        String orderId = "ord-2669499309988290";
        orderItemService.findWithProductsByOrderId(orderId);
    }

}