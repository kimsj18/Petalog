package com.example.demo.domain.admin.controller;

import com.example.demo.domain.admin.dto.ProductNewDto;
import com.example.demo.domain.admin.service.AdminProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/admin", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Slf4j
@RequiredArgsConstructor
public class adminProductNewController {

    private final AdminProductService adminProductService;

    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    @PostMapping("/products/new")
    public ResponseEntity<Map<String, Object>> adminProductsNew(
            @ModelAttribute ProductNewDto data, 
            @RequestPart(required = false) List<MultipartFile> images) {
        
        log.info("데이터 : {}", data);
        log.info("images size = {}", images != null ? images.size() : 0);
        
        try {
            String productId = adminProductService.createProduct(data, images);
            return ResponseEntity.ok(Map.of("success", true, "productId", productId));
        } catch (Exception e) {
            log.error("제품 등록 실패: ", e);
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "error", e.getMessage()));
        }
    }

}
