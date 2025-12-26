package com.example.demo.domain.admin.controller;

import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.domain.admin.service.ProductListService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public class ProductListController {

    private final ProductListService productListService;

    @GetMapping("/products")

    public List<ProductDetailDTO> getProductDetailList(){
        return productListService.findAllProductDetailList();
    }
}
