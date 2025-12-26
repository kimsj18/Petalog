package com.example.demo.domain.admin.repository;

import com.example.demo.entity.Ingredients;
import com.example.demo.entity.ProductBenefit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductBenefitRepository extends JpaRepository<ProductBenefit, String> {

    @Query("""
        SELECT b FROM ProductBenefit b WHERE b.products.productsId = :productsId
""")
    List<ProductBenefit> findAllByProductsId(@Param("productsId") String products);

    List<ProductBenefit> findByProducts_ProductsIdIn(List<String > productIds);


}

