package com.example.demo.domain.user.repository;

import com.example.demo.entity.Ingredients;
import com.example.demo.entity.ProductBenefit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientListRepository extends JpaRepository<Ingredients, String > {

    List<Ingredients> findByProducts_ProductsIdIn(List<String > productIds);

}
