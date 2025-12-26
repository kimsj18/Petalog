package com.example.demo.domain.admin.service;

import com.example.demo.domain.admin.dto.ProductDetailDTO;

import java.util.List;

public interface ProductListService {

    List<ProductDetailDTO> findAllProductDetailList();
}
