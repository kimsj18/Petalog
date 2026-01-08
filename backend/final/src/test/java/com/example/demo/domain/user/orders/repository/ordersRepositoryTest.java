package com.example.demo.domain.user.orders.repository;

import com.example.demo.domain.user.orders.DTO.OrderDTO;
import com.example.demo.entity.Orders;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class ordersRepositoryTest {

    @Autowired
    private OrdersRepository ordersRepository;

    @Test
    void findByUser_userId(){
        String userId = "USR-2665651803248435";
        List<Orders> ordersList = ordersRepository.findByUser_userId(userId);
        ordersList.forEach(System.out::println);
    }

}