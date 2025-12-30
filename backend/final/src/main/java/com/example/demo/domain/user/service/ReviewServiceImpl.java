package com.example.demo.domain.user.service;

import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.domain.user.DTO.ReviewDTO;
import com.example.demo.domain.user.DTO.ReviewSummaryDTO;
import com.example.demo.domain.user.repository.ProductsfindRepository;
import com.example.demo.domain.user.repository.ReviewRepository;
import com.example.demo.entity.Products;
import com.example.demo.entity.Review;
import com.example.demo.entity.User;
import com.example.demo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{

    private final ReviewRepository reviewRepository;
    private final ProductsfindRepository productsfindRepository;
    private final OAuthRepository oAuthRepository;

    /***
     * 리뷰 작성
     * @param dto
     * @param productId
     * @param userId
     */
    @Override
    public void reviewSave(ReviewDTO dto, String productId, String userId, String userName) {
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
                .userName(userName)
                .createdAt(LocalDate.now())
                .user(user)
                .build();
        reviewRepository.save(review);
    }

    /***
     * 리뷰 전체조회
     * @return
     */
    @Override
    public List<ReviewDTO> reviewAllFind(String productId) {

        Products products = productsfindRepository.findById(productId).orElseThrow(() ->
                new IllegalArgumentException("상품을 찾을 수 없습니다."));
        return reviewRepository.findByProducts(products).stream()
                .map(r -> new ReviewDTO(
                        r.getId(),
                        r.getTitle(),
                        r.getContent(),
                        r.getScore(),
                        r.getUserName(),
                        r.getCreatedAt()
                )).toList();
    }

    /***
     * 리뷰 서머리 조회
     * @param productId
     * @return
     */
    @Override
    public ReviewSummaryDTO reviewSummaryFind(String productId) {
        int reviewCount = reviewRepository.countByProducts_ProductsId(productId);
        Double reviewAvg = reviewRepository.avgScoreByProductId(productId);
        ReviewSummaryDTO dto = new ReviewSummaryDTO(
                reviewCount,
                reviewAvg
        );
        return dto;
    }
}
