package com.example.demo.domain.user.service;

import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.domain.user.DTO.ReviewDTO;
import com.example.demo.domain.user.repository.ProductsfindRepository;
import com.example.demo.domain.user.repository.ReviewRepository;
import com.example.demo.entity.Products;
import com.example.demo.entity.Review;
import com.example.demo.entity.User;
import com.example.demo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{

    private final ReviewRepository reviewRepository;
    private final ProductsfindRepository productsfindRepository;
    private final OAuthRepository oAuthRepository;

    @Override
    public void reviewSave(ReviewDTO dto, String productId, String userId) {
        User user = oAuthRepository.findById(userId).orElseThrow(() ->
                new IllegalArgumentException("유저를 찾을수 없습니다."));

        Products products = productsfindRepository.findById(productId).orElseThrow(() ->
                new IllegalArgumentException("상품을 찾을 수 없습니다."));


        Review review = Review.builder()
                .id(IdGenerator.reviewId())
                .title(dto.getTitle())
                .content(dto.getContent())
                .score(dto.getScore())
                .products(products)
                .user(user)
                .build();
        reviewRepository.save(review);
    }
}
