package com.example.demo.domain.user.repository;

import com.example.demo.entity.Products;
import com.example.demo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String > {

    List<Review> findByProducts(Products products);

    int countByProducts_ProductsId(String productId);

    @Query("""
        select avg(r.score)
        from Review r
        where r.products.productsId = :productId
""")
    Double avgScoreByProductId(String productId);



}
