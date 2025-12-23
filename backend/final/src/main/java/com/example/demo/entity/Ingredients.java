package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredients")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredients {

    @Id
    @Column(name = "ingredients_id", length = 25)
    private String ingredientsId;

    @Column(name = "ingredients_name", nullable = false, length = 10)
    private String ingredientsName;

    @Column(name = "ingredients_percentage", nullable = false)
    private int ingredientsPercentage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "products_id", nullable = false)
    private Products products;

}
