package com.example.demo.domain.admin.repository;

import com.example.demo.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductsListRepository extends JpaRepository<Products, String > {

    @Query("""
    select distinct p
    from Products p
    left join fetch p.ingredients
    left join fetch p.benefits
    
""")
    List<Products> findAllWithAll();

}
