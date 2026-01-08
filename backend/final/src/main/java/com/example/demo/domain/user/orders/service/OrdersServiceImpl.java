package com.example.demo.domain.user.orders.service;

import com.example.demo.domain.user.orders.DTO.OrderDTO;
import com.example.demo.domain.user.orders.repository.OrdersRepository;
import com.example.demo.entity.Orders;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrdersServiceImpl implements OrdersService {

    private final OrdersRepository ordersRepository;


    @Override
    public List<OrderDTO> findByUser_userId(String userId) {
        List<Orders> orders = ordersRepository.findByUser_userId(userId);

        List<OrderDTO> orderDTOS = orders.stream()
                .map(order -> new OrderDTO(
                        order.getOrdersId(),
                        order.getRecipientName(),
                        order.getRecipientPhone(),
                        order.getZipcode(),
                        order.getAddress1(),
                        order.getAddress2(),
                        order.getOrderNumber(),
                        order.getTotalAmount(),
                        order.getDeliveryFee(),
                        order.getFinalAmount(),
                        order.getOrderStatus(),
                        order.getCreatedAt(),
                        order.getUpdateAt()
                )).toList();
        System.out.println(orderDTOS);
        return orderDTOS;
    }
}
