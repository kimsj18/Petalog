package com.example.demo.domain.user.repository;
import com.example.demo.domain.admin.dto.BenefitDTO;
import com.example.demo.domain.admin.dto.IngredientDTO;
import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.entity.Ingredients;
import com.example.demo.entity.ProductBenefit;
import com.example.demo.entity.Products;
import com.example.demo.vo.enums.Category;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootTest
class ProductsCategoryListRepositoryTest {

    @Autowired
    private ProductsfindRepository productsCategoryListRepository;

    @Autowired
    private IngredientListRepository ingredientListRepository;

    @Autowired
    private BenefitListRepository benefitListRepository;

    @Test
    void findAllWithCategory(){
        //given
        String  category = Category.cookie.toString();

        // when
        List<Products> products = productsCategoryListRepository.findAllWithCategory(category);

        List<String > productsId = new ArrayList<>();
        for(Products p : products){
            productsId.add(p.getProductsId());
        }

        List<Ingredients> ingredients = ingredientListRepository.findByProducts_ProductsIdIn(productsId);
        List<ProductBenefit> benefits = benefitListRepository.findByProducts_ProductsIdIn(productsId);

        Map<String , List<IngredientDTO>> ingredientMap = new HashMap<>();

        for (Ingredients i : ingredients){
            String productId = i.getProducts().getProductsId();

            ingredientMap.putIfAbsent(productId, new ArrayList<>());
            ingredientMap.get(productId).add(
                    new IngredientDTO(
                            i.getIngredientsName(),
                            i.getIngredientsPercentage()
                    )
            );
        }

        Map<String , List<BenefitDTO>> benefitMap = new HashMap<>();

        for(ProductBenefit b : benefits){
            String productId = b.getProducts().getProductsId();

            benefitMap.putIfAbsent(productId, new ArrayList<>());
            benefitMap.get(productId).add(
                    new BenefitDTO(
                            b.getBenefitName()
                    )
            );
        }


        // then
//        products.forEach(p -> {
//            System.out.println(p.getProductsId());
//            System.out.println(p.getName());
//            System.out.println(p.getCategory());
//        });

        List<ProductDetailDTO> result = new ArrayList<>();

        for(Products p : products){
            result.add(new ProductDetailDTO(
                    p.getProductsId(),
                    p.getName(),
                    p.getBrand(),
                    p.getCategory(),
                    p.getSnackType(),
                    p.getImageUrl(),
                    p.getMadein(),
                    p.getQuantity(),
                    p.getSize(),
                    p.getPrice(),
                    p.getDescription(),
                    ingredientMap.getOrDefault(p.getProductsId(), List.of()),
                    benefitMap.getOrDefault(p.getProductsId(), List.of())
            ));
        }
        System.out.println(result);
    }


}