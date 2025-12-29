package com.example.demo.domain.user.repository;

import com.example.demo.entity.ProductBenefit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BenefitListRepository extends JpaRepository<ProductBenefit, String > {

    List<ProductBenefit> findByProducts_ProductsIdIn(List<String > productIds);

}
