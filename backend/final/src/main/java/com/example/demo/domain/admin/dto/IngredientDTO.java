package com.example.demo.domain.admin.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IngredientDTO {

    private String name;
    private int percentage;
}
