package com.example.demo.domain.user.orderItem.controller;

import com.example.demo.domain.user.orderItem.DTO.OrderItemDTO;
import com.example.demo.domain.user.orderItem.service.OrderItemService;
import com.example.demo.domain.user.orders.DTO.OrderDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
@Log4j2
public class OrderItemController {

    private final OrderItemService orderItemService;

    @GetMapping("/orders/detail")
    public List<OrderItemDTO> findWithProductsByOrderId(
            @RequestParam String orderId
            ){
        log.info(orderId);
        return orderItemService.findWithProductsByOrderId(orderId);
    }
}
