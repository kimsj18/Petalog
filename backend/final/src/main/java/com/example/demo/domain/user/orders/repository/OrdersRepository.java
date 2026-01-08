package com.example.demo.domain.user.orders.repository;

import com.example.demo.domain.user.orders.DTO.OrderDTO;
import com.example.demo.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, String > {

    List<Orders> findByUser_userId(String userId);



}
