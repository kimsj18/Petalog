package com.example.demo.domain.user.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CartItemListDTO {
    private String cartItemId;
    private String productId;
    private String productName;
    private int price;
    private int quantity;
    private String brand;
    private String imageUrl;
}
