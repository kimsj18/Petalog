package com.example.demo.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailDTO {

    private String productsId;
    private String name;
    private String brand;
    private String category;
    private String snackType;
    private String imageUrl;
    private String madeIn;
    private int quantity;
    private int size;
    private int price;
    private String description;

    private List<IngredientDTO> ingredientDTOs;
    private List<BenefitDTO> benefitDTOs;




    @Override
    public String toString() {
        return """
            ────────── Product Detail ──────────
            name        : %s
            brand       : %s
            category    : %s
            snackType   : %s
            imageUrl    : %s
            quantity    : %d
            madeIn      : %s
            size        : %d
            price       : %d
            description : %s
            ingredients : %s
            benefits    : %s
            ───────────────────────────────────
            """.formatted(
                name,
                brand,
                category,
                snackType,
                imageUrl,
                quantity,
                madeIn,
                size,
                price,
                description,
                ingredientDTOs,
                benefitDTOs
            );
    }
}
