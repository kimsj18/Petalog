package com.example.demo.domain.user.orderItem.service;

import com.example.demo.domain.user.orderItem.DTO.OrderItemDTO;
import com.example.demo.domain.user.payments.repository.OrderItemRepository;
import com.example.demo.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class OrderItemServiceImpl implements OrderItemService{

    private final OrderItemRepository orderItemRepository;


    @Override
    public List<OrderItemDTO> findWithProductsByOrderId(String orderId) {
        List<OrderItem> orderItems = orderItemRepository.findWithProductsByOrderId(orderId);

        List<OrderItemDTO> orderItemDTOS = orderItems.stream()
                .map(orderItem -> new OrderItemDTO(
                        orderItem.getOrderItemId(),
                        orderItem.getProducts().getProductsId(),
                        orderItem.getProducts().getName(),
                        orderItem.getQuantity(),
                        orderItem.getProducts().getPrice(),
                        orderItem.getProducts().getBrand(),
                        orderItem.getProducts().getMadein(),
                        orderItem.getProducts().getCategory()
                )).toList();
        System.out.println(orderItemDTOS);
        return orderItemDTOS;
    }
}
