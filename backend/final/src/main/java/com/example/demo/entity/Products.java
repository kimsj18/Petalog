package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @Column(name = "snack_type", nullable = false, length = 25)
    private String snackType;

    @Column(name = "imageUrl", columnDefinition = "LONGTEXT", nullable = false)
    private String imageUrl;

    @Column(name = "size", nullable = false)
    private int size;

    @Column(name = "madein", nullable = false, length = 25)
    private String madein;

}
