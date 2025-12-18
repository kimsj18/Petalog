package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "pets")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pets {

    @Id
    @Column(name = "pets_id", length = 25)
    private String petsId;

    @Column(name = "pets_name", nullable = false, length = 25)
    private String petsName;

    @Column(name = "pets_birth")
    private LocalDate petsBirth;

    @Column(name = "pets_weight")
    private Integer petsWeight;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "pets_snack_type", length = 25)
    private String petsSnackType;

    @Column(name = "pets_ingredients", length = 25)
    private String petsIngredients;
}
