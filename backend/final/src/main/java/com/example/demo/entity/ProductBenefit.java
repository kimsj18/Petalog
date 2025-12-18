package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_benefit")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductBenefit {

    @Id
    @Column(name = "benefit_id", length = 25)
    private String benefitId;

    @Column(name = "benefit_name", nullable = false, length = 50)
    private String benefitName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "products_id", nullable = false)
    private Products products;

}
