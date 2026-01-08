package com.example.demo.domain.user.orders.controller;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.user.orders.DTO.OrderDTO;
import com.example.demo.domain.user.orders.service.OrdersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/v1/user")
public class OrderController {

    private final OrdersService ordersService;

    @GetMapping("/orders")
    public List<OrderDTO> findByUser_userId(
            @AuthenticationPrincipal UserDTO userDTO
            ){
        return ordersService.findByUser_userId(userDTO.getUserId());
    }

}
