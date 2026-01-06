package com.example.demo.domain.user.repository;

import com.example.demo.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductsfindRepository extends JpaRepository<Products, String > {

    @Query("""
    select p
    from Products p
    where p.category = :category
""")
    List<Products> findAllWithCategory(String  category);

    Optional<Products> findById(String productId);

    @Query("""
    select distinct p
    from Products p
    left join fetch p.ingredients
    where p.productsId = :productId
""")
    Optional<Products> findDetailById(@Param("productId") String productId);

    @Query("""
        select distinct p
        from Products p
        join p.ingredients i
        where i.ingredientsName = :ingredient
""")
    List<Products> findAllWithIngredient(@Param("ingredient") String ingredient);

    @Query("""
        select distinct p
        from Products p
        left join fetch p.ingredients
        where p.name like %:keyword%
            or p.brand like %:keyword%
""")
    List<Products> searchByNameOrBrand(@Param("keyword") String keyword);
}
