package com.example.demo.domain.user.orders.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrdersServiceImplTest {

    @Autowired
    private OrdersService ordersService;

    @Test
    void findByUser_userId(){
        String userId = "USR-2665651803248435";
        ordersService.findByUser_userId(userId);
    }

}