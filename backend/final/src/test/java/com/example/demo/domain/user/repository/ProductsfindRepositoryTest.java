package com.example.demo.domain.user.repository;

import com.example.demo.domain.admin.dto.BenefitDTO;
import com.example.demo.domain.admin.dto.IngredientDTO;
import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.entity.Products;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductsfindRepositoryTest {

    @Autowired
    private ProductsfindRepository productsfindRepository;

    @Test
    void findById(){

        Optional<Products> products = productsfindRepository.findById("PROD_1766456502508");

        System.out.println(products.get());
    }

    @Transactional
    @Test
    void findDetailById(){

       Products products = productsfindRepository.findDetailById("PROD_1766761490157")
               .orElseThrow(() -> new RuntimeException("상품 없음"));

       List<IngredientDTO> ingredientDTOS = products.getIngredients().stream()
               .map(i -> new IngredientDTO(i.getIngredientsName(), i.getIngredientsPercentage())).toList();

       List<BenefitDTO> benefitDTOS = products.getBenefits().stream()
               .map(b -> new BenefitDTO(b.getBenefitName())).toList();

        ProductDetailDTO dto = new ProductDetailDTO(
                products.getProductsId(),
                products.getName(),
                products.getBrand(),
                products.getCategory(),
                products.getSnackType(),
                products.getImageUrl(),
                products.getMadein(),
                products.getQuantity(),
                products.getSize(),
                products.getPrice(),
                products.getDescription(),
                ingredientDTOS,
                benefitDTOS
        );
        System.out.println(dto);






    }

}