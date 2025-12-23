package com.example.demo.domain.admin.repository;

import com.example.demo.entity.Products;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductsListRepositoryTest {

    @Autowired
    private ProductsListRepository productsListRepository;

    @Test
    void findAllList(){
        List<Products> products = productsListRepository.findAll();

        products.forEach(System.out::println);
    }

    @Test
    void findAllWithAllTest(){
        List<Products> products = productsListRepository.findAllWithAll();

        assertNotNull(products);

        products.forEach(p -> {
            System.out.println("상품 ID: " + p.getProductsId());
            System.out.println("상품명: " + p.getName());
            System.out.println("브랜드: " + p.getBrand());
            System.out.println("카테고리: " + p.getCategory());
            System.out.println("가격: " + p.get());
            System.out.println("원산지: " + p.getMadein());

            System.out.println("=== 재료 ===");
            p.getIngredients().forEach(i ->
                    System.out.println(
                            i.getIngredientsName() + " / " + i.getIngredientsPercentage()
                    )
            );

            System.out.println("=== 효능 ===");
            p.getBenefits().forEach(b ->
                    System.out.println(b.getBenefitName())
            );

            System.out.println("================================");
        });
    }

}