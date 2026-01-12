package com.example.demo.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${spring.cloud.aws.region.static}")
    private String region;

    public List<String> uploadImages(List<MultipartFile> images) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        if (images == null || images.isEmpty()) {
            log.warn("업로드할 이미지가 없습니다.");
            return imageUrls;
        }

        log.info("이미지 업로드 시작: {} 개의 파일", images.size());

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                try {
                    String imageUrl = uploadImage(image);
                    imageUrls.add(imageUrl);
                    log.info("이미지 업로드 성공: {}", imageUrl);
                } catch (Exception e) {
                    log.error("이미지 업로드 실패: {}", image.getOriginalFilename(), e);
                    throw new IOException("이미지 업로드 중 오류 발생: " + e.getMessage(), e);
                }
            }
        }

        log.info("모든 이미지 업로드 완료: {} 개", imageUrls.size());
        return imageUrls;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String savedFilename = "products/" + UUID.randomUUID().toString() + extension;

        log.info("S3 업로드 시작: 원본 파일명={}, 저장 파일명={}, 크기={} bytes",
                originalFilename, savedFilename, file.getSize());

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            PutObjectRequest putObjectRequest = new PutObjectRequest(
                    bucket,
                    savedFilename,
                    file.getInputStream(),
                    metadata
            );

            amazonS3.putObject(putObjectRequest);

            // S3 URL 생성
            String imageUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, savedFilename);
            log.info("S3 업로드 완료: {}", imageUrl);

            return imageUrl;
        } catch (Exception e) {
            log.error("S3 업로드 실패: bucket={}, key={}, error={}",
                    bucket, savedFilename, e.getMessage(), e);
            throw new IOException("S3 업로드 실패: " + e.getMessage(), e);
        }
    }
}