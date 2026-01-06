package com.example.demo.domain.user.service;

import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.vo.enums.Category;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductsListServiceImplTest {

    @Autowired
    private ProductsListService productsListService;

    @Test
    @DisplayName("유저 - 상품리스트(카테고리)")
    void findAllProductCategoryListTest(){
        Category category = Category.cookie;

        productsListService.findAllProductsCategoryList(category);
    }

    @ParameterizedTest
    @EnumSource(Category.class)
    @DisplayName("유저 - 상품리스트(카테고리)")
    void findAllProductCategoryListTest(Category category) {

        List<ProductDetailDTO> result =
                productsListService.findAllProductsCategoryList(category);

        assertNotNull(result);
    }

    @Test
    @DisplayName("유저 - 상품 상세정보")
    void findDetailByProductId(){
        String productId = new String("PROD_1766757861121");
        ProductDetailDTO result = productsListService.findDetailByProductId(productId);
        assertNotNull(result);
    }


    @Test
    @DisplayName("유저 - 상품 원재료별 조회")
    void findAllWithIngredient(){
        String ingredient = new String("닭고기");
        List<ProductDetailDTO> r = productsListService.findAllWithIngredient(ingredient);
        System.out.println(r);
    }

    @Test
    @DisplayName("유저 - 상품 검색")
    void searchByNameOrBrand(){
        String keyword = "이것";
        System.out.println(keyword);
        List<ProductDetailDTO> productDetailDTOS = productsListService.searchByNameOrBrand(keyword);
        System.out.println(productDetailDTOS);
    }
}