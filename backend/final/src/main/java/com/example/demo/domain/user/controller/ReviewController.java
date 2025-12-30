package com.example.demo.domain.user.controller;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.user.DTO.ReviewDTO;
import com.example.demo.domain.user.DTO.ReviewSummaryDTO;
import com.example.demo.domain.user.service.ReviewService;
import com.example.demo.entity.Review;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/v1")
public class ReviewController {

    private final ReviewService reviewService;

    /***
     * 리뷰 작성
     * @param dto
     * @param productId
     * @param userDTO
     */
    @PostMapping("/products/{productId}/review")
    public void reviewSave(
            @RequestBody ReviewDTO dto,
            @PathVariable String productId,
            @AuthenticationPrincipal UserDTO userDTO
    ){
        log.info("리뷰작성 유저디티오:  "+userDTO);

        String userId = userDTO.getUserId();
        String userName = userDTO.getName();
        reviewService.reviewSave(dto, productId, userId, userName);
    }

    /***
     * 리뷰전체조회
     */
    @GetMapping("/products/{productId}/reviewAll")
    public List<ReviewDTO> reviewAllFind(@PathVariable String productId){

        return reviewService.reviewAllFind(productId);
    }

    @GetMapping("/products/{productId}/reviewSummary")
    public ReviewSummaryDTO reviewSummaryFind(@PathVariable String productId){

        return reviewService.reviewSummaryFind(productId);
    }

}
