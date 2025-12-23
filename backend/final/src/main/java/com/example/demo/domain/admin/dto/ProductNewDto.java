package com.example.demo.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductNewDto {
    private String name;
    private String brand;
    private String category;
    private String description;
    private int price;
    private String size;
    private String madeIn;
    private String stockQuantity;
    private String image;
    private String ingredients;
    private String benefits;
}
