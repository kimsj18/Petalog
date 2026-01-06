package com.example.demo.domain.user.service;

import com.example.demo.domain.user.DTO.ReviewDTO;
import com.example.demo.domain.user.DTO.ReviewSummaryDTO;
import com.example.demo.entity.Review;

import java.util.List;

public interface ReviewService {

    void reviewSave(ReviewDTO dto, String productId, String userId, String userName);

    List<ReviewDTO> reviewAllFind(String productId);

    ReviewSummaryDTO reviewSummaryFind(String productId);


}