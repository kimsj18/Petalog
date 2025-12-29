package com.example.demo.domain.user.service;

import com.example.demo.domain.user.DTO.ReviewDTO;

public interface ReviewService {

    void reviewSave(ReviewDTO dto, String productId, String userId);
}