package com.example.demo.domain.admin.repository;

import com.example.demo.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductsListRepository extends JpaRepository<Products, String > {


    List<Products> findAllBy();

}
