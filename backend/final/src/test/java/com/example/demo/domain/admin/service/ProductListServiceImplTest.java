package com.example.demo.domain.admin.service;

import com.example.demo.domain.admin.dto.ProductDetailDTO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class ProductListServiceImplTest {

    @Autowired
    private ProductListService productListService;

    @Test
    @DisplayName("관리자 - 상품리스트")
    void findAllProductDetailList(){
        //when
//        List<ProductDetailDTO> result = productListService.findAllProductDetailList();
        productListService.findAllProductDetailList();

        // then
//        assertThat(result).isNotNull();
//        assertThat(result).isNotEmpty();

//        result.forEach(System.out::println);

    }


}