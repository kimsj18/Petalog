package com.example.demo.domain.admin.repository;

import com.example.demo.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<Products, String> {
}

