package com.example.demo.domain.user.orderItem.repository;

import com.example.demo.domain.user.orders.repository.OrdersRepository;
import com.example.demo.domain.user.payments.repository.OrderItemRepository;
import com.example.demo.entity.OrderItem;
import com.example.demo.entity.Orders;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OrderItemRepositoryTest {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrdersRepository ordersRepository;

//    @Test
//    void findByOrdersIn(){
//        String userId = "USR-2665651803248435";
//
//        List<Orders> orders = ordersRepository.findByUser_userId(userId);
//
//        List<OrderItem> orderItems = orderItemRepository.findByOrdersIn(orders);
//        System.out.println(orderItems);
//
//    }

}