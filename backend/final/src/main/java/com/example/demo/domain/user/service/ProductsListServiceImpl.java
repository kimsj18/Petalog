package com.example.demo.domain.user.service;

import com.example.demo.domain.admin.dto.BenefitDTO;
import com.example.demo.domain.admin.dto.IngredientDTO;
import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.domain.user.payments.repository.OrderItemRepository;
import com.example.demo.domain.user.repository.BenefitListRepository;
import com.example.demo.domain.user.repository.IngredientListRepository;
import com.example.demo.domain.user.repository.ProductsfindRepository;
import com.example.demo.entity.Ingredients;
import com.example.demo.entity.ProductBenefit;
import com.example.demo.entity.Products;
import com.example.demo.vo.enums.Category;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductsListServiceImpl implements ProductsListService {


    private final ProductsfindRepository productsfindRepository;
    private final IngredientListRepository ingredientListRepository;
    private final BenefitListRepository benefitListRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public List<ProductDetailDTO> findAllProductsCategoryList(Category category) {

        List<Products> products = productsfindRepository.findAllWithCategory(category.toString());

        List<String> productsId = new ArrayList<>();
        for (Products p : products) {
            productsId.add(p.getProductsId());
        }

        List<Ingredients> ingredients = ingredientListRepository.findByProducts_ProductsIdIn(productsId);
        List<ProductBenefit> benefits = benefitListRepository.findByProducts_ProductsIdIn(productsId);

        Map<String, List<IngredientDTO>> ingredientMap = new HashMap<>();

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

        Map<String, List<BenefitDTO>> benefitMap = new HashMap<>();

        for (ProductBenefit b : benefits) {
            String productId = b.getProducts().getProductsId();

            benefitMap.putIfAbsent(productId, new ArrayList<>());
            benefitMap.get(productId).add(
                    new BenefitDTO(
                            b.getBenefitName()
                    )
            );
        }

        List<ProductDetailDTO> result = new ArrayList<>();

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
        }
        System.out.println(result);
        return result;
    }

    @Override
    public ProductDetailDTO findDetailByProductId(String productId) {
        Products products = productsfindRepository.findDetailById(productId)
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
        return dto;
    }

    @Override
    public List<ProductDetailDTO> findAllWithIngredient(String ingredient) {
        List<Products> products = productsfindRepository.findAllWithIngredient(ingredient);

        List<ProductDetailDTO> productDetailDTOS = products.stream()
                .map(p -> {
                    List<IngredientDTO> ingredientDTOS = p.getIngredients().stream()
                            .map(i -> new IngredientDTO(i.getIngredientsName(), i.getIngredientsPercentage()))
                            .toList();

                    List<BenefitDTO> benefitDTOS = p.getBenefits().stream()
                            .map(b -> new BenefitDTO(b.getBenefitName()))
                            .toList();

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
                            ingredientDTOS,
                            benefitDTOS
                    );
                    return dto;
                }).toList();
//        System.out.println(productDetailDTOS);
        return productDetailDTOS;
    }

    @Override
    public List<ProductDetailDTO> searchByNameOrBrand(String keyword) {

        List<Products> products = productsfindRepository.searchByNameOrBrand(keyword);

        List<ProductDetailDTO> productDetailDTOS = products.stream()
                .map(p -> {
                    List<IngredientDTO> ingredientDTOS = p.getIngredients().stream()
                            .map(i -> new IngredientDTO(i.getIngredientsName(), i.getIngredientsPercentage()))
                            .toList();

                    List<BenefitDTO> benefitDTOS = p.getBenefits().stream()
                            .map(b -> new BenefitDTO(b.getBenefitName())).toList();

                    return new ProductDetailDTO(
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
                            ingredientDTOS,
                            benefitDTOS
                    );
                }).toList();

        return productDetailDTOS;
    }

    @Override
    public List<ProductDetailDTO> findTopProductsByOrderQuantity(int limit) {
        // 주문량 합계로 상위 제품 ID 조회
        List<Object[]> results = orderItemRepository.findTopProductsByOrderQuantity();
        
        List<String> productIds = results.stream()
                .limit(limit)
                .map(result -> (String) result[0])
                .collect(Collectors.toList());
        
        if (productIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 상품 정보 조회
        List<Products> products = productsfindRepository.findAllById(productIds);
        
        // 순서 유지를 위한 맵 생성
        Map<String, Products> productMap = products.stream()
                .collect(Collectors.toMap(Products::getProductsId, p -> p));
        
        // 원래 순서대로 정렬
        List<Products> orderedProducts = productIds.stream()
                .map(productMap::get)
                .filter(p -> p != null)
                .collect(Collectors.toList());
        
        // 재료 및 혜택 정보 조회
        List<Ingredients> ingredients = ingredientListRepository.findByProducts_ProductsIdIn(productIds);
        List<ProductBenefit> benefits = benefitListRepository.findByProducts_ProductsIdIn(productIds);
        
        Map<String, List<IngredientDTO>> ingredientMap = new HashMap<>();
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
        
        Map<String, List<BenefitDTO>> benefitMap = new HashMap<>();
        for (ProductBenefit b : benefits) {
            String productId = b.getProducts().getProductsId();
            benefitMap.putIfAbsent(productId, new ArrayList<>());
            benefitMap.get(productId).add(
                    new BenefitDTO(
                            b.getBenefitName()
                    )
            );
        }
        
        // ProductDetailDTO 리스트 생성
        List<ProductDetailDTO> result = new ArrayList<>();
        for (Products p : orderedProducts) {
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
        
        return result;
    }

}





