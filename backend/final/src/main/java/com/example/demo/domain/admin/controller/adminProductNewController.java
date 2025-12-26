package com.example.demo.domain.admin.controller;

import com.example.demo.domain.admin.dto.BenefitDTO;
import com.example.demo.domain.admin.dto.IngredientDTO;
import com.example.demo.domain.admin.dto.ProductDetailDTO;
import com.example.demo.domain.admin.dto.ProductNewDto;
import com.example.demo.domain.admin.service.AdminProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/admin", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Slf4j
@RequiredArgsConstructor
public class adminProductNewController {

    private final AdminProductService adminProductService;
    private final ObjectMapper objectMapper;

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

    @PostMapping("products/{productId}/edit")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN')")
    public ResponseEntity<Map<String , Object>> adminProductsEdit(
            @PathVariable String productId,
            @ModelAttribute ProductDetailDTO data,
            @RequestPart(required = false) List<MultipartFile> images,
            @RequestParam(required = false) String ingredients,
            @RequestParam(required = false) String benefits){
        data.setProductsId(productId);

        try {
            if (ingredients != null && !ingredients.isEmpty()) {
                List<IngredientDTO> ingredientDTOs = objectMapper.readValue(
                        ingredients,
                        new TypeReference<List<IngredientDTO>>() {}
                );
                data.setIngredientDTOs(ingredientDTOs);
            }

            if (benefits != null && !benefits.isEmpty()) {
                // benefits는 문자열 배열이므로 먼저 파싱 후 BenefitDTO 리스트로 변환
                List<String> benefitNames = objectMapper.readValue(
                        benefits,
                        new TypeReference<List<String>>() {}
                );
                List<BenefitDTO> benefitDTOs = new ArrayList<>();
                for (String name : benefitNames) {
                    benefitDTOs.add(new BenefitDTO(name));
                }
                data.setBenefitDTOs(benefitDTOs);
            }

            if(images != null && !images.isEmpty()){
                try {
                    List<String > newImageUrls = adminProductService.saveImages(images);

                    //기존 이미지와 합치기
                    String existingImageUrl = data.getImageUrl() != null ? data.getImageUrl() : "";
                    List<String > allImageUrls = new ArrayList<>();

                    if(!existingImageUrl.isEmpty()){
                        String[] existingUrls = existingImageUrl.split(",");
                        for(String url : existingUrls){
                            if(!url.trim().isEmpty()){
                                allImageUrls.add(url.trim());
                            }
                        }
                    }
                    allImageUrls.addAll(newImageUrls);
                    String finalImageUrl = String.join(",",allImageUrls);
                    data.setImageUrl(finalImageUrl);

                    log.info("wjwkdehls dlalwl URL: " + finalImageUrl);
                }catch (Exception e){
                    log.error("이미지 저장 실패" , e);
                }
            }
        } catch (Exception e) {
            log.error("JSON 파싱 실패: ", e);
        }

        log.info(data.toString());
        adminProductService.updateProduct(data, images);

        return ResponseEntity.ok(Map.of("success", true, "message", "상품수정완료"));
    }

}
