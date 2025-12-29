package com.example.demo.domain.user.controller;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.user.DTO.ReviewDTO;
import com.example.demo.domain.user.service.ReviewService;
import com.example.demo.entity.Review;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/v1")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/products/{productId}/review")
    public void reviewSave(
            @RequestBody ReviewDTO dto,
            @PathVariable String productId,
            @AuthenticationPrincipal UserDTO userDTO
    ){
        String userId = userDTO.getUserId();
        reviewService.reviewSave(dto, productId, userId);

    }

}
