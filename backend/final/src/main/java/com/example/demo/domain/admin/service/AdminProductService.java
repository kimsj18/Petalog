package com.example.demo.domain.admin.service;

import com.example.demo.domain.admin.dto.ProductNewDto;
import com.example.demo.domain.admin.repository.IngredientsRepository;
import com.example.demo.domain.admin.repository.ProductBenefitRepository;
import com.example.demo.domain.admin.repository.ProductsRepository;
import com.example.demo.entity.Ingredients;
import com.example.demo.entity.ProductBenefit;
import com.example.demo.entity.Products;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminProductService {

    private final ProductsRepository productsRepository;
    private final IngredientsRepository ingredientsRepository;
    private final ProductBenefitRepository productBenefitRepository;
    private final ObjectMapper objectMapper;

    // 이미지 저장 경로 (application.properties에서 설정 가능)
    private static final String UPLOAD_DIR = "uploads/products/";

    @Transactional
    public String createProduct(ProductNewDto dto, List<MultipartFile> images) {
        try {
            // 1. 이미지 파일 저장 및 URL 생성
            List<String> imageUrls = saveImages(images);
            String imageUrlString = String.join(",", imageUrls);
            log.info("dto : " + dto);
            log.info("imageUrlString : " +imageUrlString);
            // 2. Products 엔티티 생성 및 저장
            String productsId = generateProductId();
            Products product = Products.builder()
                    .productsId(productsId)
                    .name(dto.getName())
                    .brand(dto.getBrand())
                    .category(dto.getCategory())
                    .price(dto.getPrice())
                    .snackType(dto.getCategory()) // category를 snack_type으로 사용 (필요시 수정)
                    .imageUrl(imageUrlString)
                    .size(Integer.parseInt(dto.getSize()))
                    .madein(dto.getMadeIn())
                    .build();

            Products savedProduct = productsRepository.save(product);

            // 3. Ingredients 파싱 및 저장
            if (dto.getIngredients() != null && !dto.getIngredients().isEmpty()) {
                List<IngredientDto> ingredientList = parseIngredients(dto.getIngredients());
                saveIngredients(savedProduct, ingredientList);
            }

            // 4. Benefits 파싱 및 저장
            if (dto.getBenefits() != null && !dto.getBenefits().isEmpty()) {
                List<String> benefitList = parseBenefits(dto.getBenefits());
                saveProductBenefits(savedProduct, benefitList);
            }

            return savedProduct.getProductsId();
        } catch (Exception e) {
            log.error("제품 생성 실패: ", e);
            throw new RuntimeException("제품 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 이미지 파일 저장
    private List<String> saveImages(List<MultipartFile> images) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        
        if (images == null || images.isEmpty()) {
            return imageUrls;
        }

        // 업로드 디렉토리 생성
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String originalFilename = image.getOriginalFilename();
                String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : "";
                String savedFilename = UUID.randomUUID().toString() + extension;
                Path filePath = uploadPath.resolve(savedFilename);
                
                Files.copy(image.getInputStream(), filePath);
                
                // URL 생성 (실제 환경에서는 서버 URL 포함)
                String imageUrl = "/" + UPLOAD_DIR + savedFilename;
                imageUrls.add(imageUrl);
            }
        }

        return imageUrls;
    }

    // Ingredients JSON 파싱
    private List<IngredientDto> parseIngredients(String ingredientsJson) {
        try {
            return objectMapper.readValue(ingredientsJson, 
                new TypeReference<List<IngredientDto>>() {});
        } catch (Exception e) {
            log.error("Ingredients 파싱 실패: ", e);
            throw new RuntimeException("Ingredients 파싱 실패");
        }
    }

    // Benefits JSON 파싱
    private List<String> parseBenefits(String benefitsJson) {
        try {
            return objectMapper.readValue(benefitsJson, 
                new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.error("Benefits 파싱 실패: ", e);
            throw new RuntimeException("Benefits 파싱 실패");
        }
    }

    // Ingredients 저장
    private void saveIngredients(Products product, List<IngredientDto> ingredientList) {
        for (IngredientDto ingredientDto : ingredientList) {
            Ingredients ingredient = Ingredients.builder()
                    .ingredientsId(generateIngredientId())
                    .ingredientsName(ingredientDto.getName())
                    .ingredientsPercentage(Integer.parseInt(ingredientDto.getPercentage()))
                    .products(product)
                    .build();
            
            ingredientsRepository.save(ingredient);
        }
    }

    // ProductBenefits 저장
    private void saveProductBenefits(Products product, List<String> benefitList) {
        for (String benefitName : benefitList) {
            ProductBenefit productBenefit = ProductBenefit.builder()
                    .benefitId(generateBenefitId())
                    .benefitName(benefitName)
                    .products(product)
                    .build();
            
            productBenefitRepository.save(productBenefit);
        }
    }

    // ID 생성 메서드들
    private String generateProductId() {
        return "PROD_" + System.currentTimeMillis();
    }

    private String generateIngredientId() {
        return "ING_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 5);
    }

    private String generateBenefitId() {
        return "BEN_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 5);
    }

    // 내부 DTO 클래스
    private static class IngredientDto {
        private String id;
        private String name;
        private String percentage;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPercentage() { return percentage; }
        public void setPercentage(String percentage) { this.percentage = percentage; }
    }
}

