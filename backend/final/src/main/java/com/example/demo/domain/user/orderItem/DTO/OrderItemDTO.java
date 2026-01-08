package com.example.demo.domain.user.orderItem.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private String orderItemId;
    private String productsId;
    private String name;
    private int quantity;
    private int price;
    private String brand;
    private String madein;
    private String category;

    @Override
    public String toString() {
        return "OrderItemDTO{" +
                "orderItemId='" + orderItemId + '\'' +
                ", productsId='" + productsId + '\'' +
                ", name='" + name + '\'' +
                ", quantity='" + quantity + '\'' +
                ", price='" + price + '\'' +
                ", brand='" + brand + '\'' +
                ", madein='" + madein + '\'' +
                ", category='" + category + '\'' +
                '}';
    }
}
