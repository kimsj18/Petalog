package com.example.demo.domain.user.service;

import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.vo.enums.Category;

import java.util.List;

public interface ProductsListService {

    List<ProductDetailDTO> findAllProductsCategoryList(Category category);

    ProductDetailDTO findDetailByProductId(String productId);

    List<ProductDetailDTO> findAllWithIngredient(String ingredient);

    List<ProductDetailDTO> searchByNameOrBrand(String keyword);

    List<ProductDetailDTO> findTopProductsByOrderQuantity(int limit);
}
