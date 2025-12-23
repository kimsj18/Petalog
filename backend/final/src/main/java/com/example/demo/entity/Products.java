package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Products {

    @Id
    @Column(name = "products_id", length = 25)
    private String productsId;

    @Column(name = "name", nullable = false, length = 25)
    private String name;

    @Column(name = "brand", nullable = false, length = 25)
    private String brand;

    @Column(name = "category", nullable = false, length = 25)
    private String category;

    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "snack_type", nullable = false, length = 25)
    private String snackType;

    @Column(name = "image_url", columnDefinition = "LONGTEXT", nullable = false)
    private String imageUrl;

    @Column(name = "size", nullable = false)
    private int size;

    @Column(name = "madein", nullable = false, length = 25)
    private String madein;

    @OneToMany(mappedBy = "products", fetch = FetchType.LAZY)
    private List<Ingredients> ingredients;

    @OneToMany(mappedBy = "products", fetch = FetchType.LAZY)
    private List<ProductBenefit> benefits;

}
