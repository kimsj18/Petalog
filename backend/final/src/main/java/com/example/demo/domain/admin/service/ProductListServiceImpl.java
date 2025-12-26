package com.example.demo.domain.admin.service;

import com.example.demo.domain.admin.dto.BenefitDTO;
import com.example.demo.domain.admin.dto.IngredientDTO;
import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.domain.admin.repository.IngredientsRepository;
import com.example.demo.domain.admin.repository.ProductBenefitRepository;
import com.example.demo.domain.admin.repository.ProductsListRepository;
import com.example.demo.entity.Ingredients;
import com.example.demo.entity.ProductBenefit;
import com.example.demo.entity.Products;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductListServiceImpl implements ProductListService {

    private final ProductsListRepository productsListRepository;
    private final IngredientsRepository ingredientsRepository;
    private final ProductBenefitRepository productBenefitRepository;

    @Override
    public List<ProductDetailDTO> findAllProductDetailList() {
        List<Products> products = productsListRepository.findAllBy();
        List<String> productIds = products.stream()
                .map(Products::getProductsId)
                .toList();

        List<Ingredients> ingredients = ingredientsRepository.findByProducts_ProductsIdIn(productIds);
        List<ProductBenefit> benefits = productBenefitRepository.findByProducts_ProductsIdIn(productIds);
        Map<String, List<IngredientDTO>> ingredientMap = new HashMap<>();
        Map<String, List<BenefitDTO>> benefitMap = new HashMap<>();
        List<ProductDetailDTO> result = new ArrayList<>();

        for (Ingredients i : ingredients) {
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

        for (ProductBenefit b : benefits) {
            String productId = b.getProducts().getProductsId();

            benefitMap.putIfAbsent(productId, new ArrayList<>());
            benefitMap.get(productId).add(
                    new BenefitDTO(
                            b.getBenefitName()
                    )
            );
//            System.out.println(benefitMap);
        }

        for (Products p : products) {
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
//            System.out.println(result);
        }
        return result;
    }
}



