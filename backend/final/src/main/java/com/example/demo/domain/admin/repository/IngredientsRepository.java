package com.example.demo.domain.admin.repository;

import com.example.demo.entity.Ingredients;
import com.example.demo.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IngredientsRepository extends JpaRepository<Ingredients, String> {

    @Query("SELECT i FROM Ingredients  i WHERE i.products.productsId = :productsId ")
    List<Ingredients> findAllByProductsId(@Param("productsId") String productsId);

    List<Ingredients> findByProducts_ProductsIdIn(List<String > productIds);

//    List<Ingredients> findAllByProductsId(List<Products> products);
}

