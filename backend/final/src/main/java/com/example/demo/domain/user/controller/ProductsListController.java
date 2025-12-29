package com.example.demo.domain.user.controller;

import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.domain.user.service.ProductsListService;
import com.example.demo.vo.enums.Category;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/v1/user")
public class ProductsListController {


    private final ProductsListService productsListService;

    @GetMapping("/categoryList")
    public List<ProductDetailDTO> getProductsCateroryList(@RequestParam Category category){
        log.info("category: " + category);
        return productsListService.findAllProductsCategoryList(category);
    }

    @GetMapping("/productDetail")
    public ProductDetailDTO getProductDetail(@RequestParam String productId){
        log.info(productId);
        return productsListService.findDetailByProductId(productId);
    }
}
