package com.example.demo.domain.admin.repository;

import com.example.demo.domain.admin.dto.BenefitDTO;
import com.example.demo.domain.admin.dto.IngredientDTO;
import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.entity.Ingredients;
import com.example.demo.entity.ProductBenefit;
import com.example.demo.entity.Products;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductsListRepositoryTest {

    @Autowired
    private ProductsListRepository productsListRepository;

    @Autowired
    private IngredientsRepository ingredientsRepository;

    @Autowired
    private ProductBenefitRepository productBenefitRepository;

//    @Test
//    void findAllList(){
//        List<Products> products = productsListRepository.findAll();
//        List<ProductBenefit> benefits =
//                ProductBenefitRepository.findByProductsIn(products);
//
//        List<Ingredients> ingredients =
//                ingredientsRepository.findByProductsIn(products);
//
//        products.forEach(System.out::println);
//    }

    @Test
    void findAllWithAllTest(){
        List<Products> products = productsListRepository.findAllBy();

        assertNotNull(products);

        for(Products p : products){
            List<Ingredients> ingredients= ingredientsRepository.findAllByProductsId(p.getProductsId());
            List<ProductBenefit> benefits = productBenefitRepository.findAllByProductsId(p.getProductsId());
            System.out.println("상품 ID: " + p.getProductsId());
            System.out.println("상품명: " + p.getName());
            System.out.println("브랜드: " + p.getBrand());
            System.out.println("카테고리: " + p.getCategory());
            System.out.println("설명: "+ p.getDescription());
            System.out.println("이미지Url: " + p.getImageUrl());
            System.out.println("가격: " + p.getPrice());
            System.out.println("원산지: " + p.getMadein());
            for(Ingredients i : ingredients){
                System.out.println("재료: " + i.getIngredientsName());
                System.out.println("퍼센트: " + i.getIngredientsPercentage());
            }
            for(ProductBenefit b : benefits){
                System.out.println("효능: " + b.getBenefitName());
            }
        }
    }

    @Test
    void findAllProductsList(){
        List<Products> products = productsListRepository.findAllBy();
        List<ProductDetailDTO> result = new ArrayList<>();

        for(Products p : products){
            List<IngredientDTO> ingredientDTOs = ingredientsRepository.findAllByProductsId(p.getProductsId())
                    .stream().map(i -> new IngredientDTO(
                            i.getIngredientsName(),
                            i.getIngredientsPercentage()
                    )).toList();
            List<BenefitDTO> benefitDTOs = productBenefitRepository.findAllByProductsId(p.getProductsId())
                    .stream().map(b -> new BenefitDTO(
                            b.getBenefitName()
                    )).toList();

            ProductDetailDTO dto = new ProductDetailDTO(
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
                    ingredientDTOs,
                    benefitDTOs
            );

            result.add(dto);

            System.out.println(result);
        }

    }


    /***
     *성능개선
     */
    @Test
    void findAllProductsList1(){
        List<Products> products = productsListRepository.findAllBy();
        List<String > productIds = products.stream()
                .map(Products::getProductsId)
                .toList();

        List<Ingredients> ingredients = ingredientsRepository.findByProducts_ProductsIdIn(productIds);
        List<ProductBenefit> benefits = productBenefitRepository.findByProducts_ProductsIdIn(productIds);
        Map<String , List<IngredientDTO>> ingredientMap = new HashMap<>();
        Map<String , List<BenefitDTO>> benefitMap = new HashMap<>();
        List<ProductDetailDTO> result = new ArrayList<>();

        for(Ingredients i : ingredients){
            String productId = i.getProducts().getProductsId();

            ingredientMap.putIfAbsent(productId, new ArrayList<>());
            ingredientMap.get(productId).add(
                    new IngredientDTO(
                            i.getIngredientsName(),
                            i.getIngredientsPercentage()
                    )
            );
        }
//        System.out.println(ingredientMap);

        for(ProductBenefit b : benefits){
            String productId = b.getProducts().getProductsId();

            benefitMap.putIfAbsent(productId, new ArrayList<>());
            benefitMap.get(productId).add(
                    new BenefitDTO(
                            b.getBenefitName()
                    )
            );
//            System.out.println(benefitMap);
        }

        for(Products p : products ){
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
            System.out.println(result);
        }
    }


}