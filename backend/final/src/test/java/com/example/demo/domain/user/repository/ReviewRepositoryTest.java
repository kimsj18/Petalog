package com.example.demo.domain.user.repository;

import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.domain.user.DTO.ReviewDTO;
import com.example.demo.entity.Products;
import com.example.demo.entity.Review;
import com.example.demo.entity.User;
import com.example.demo.util.IdGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ReviewRepositoryTest {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OAuthRepository oAuthRepository;

    @Autowired
    private ProductsfindRepository productsfindRepository;

    @Test
    void saveReview(){

        User user = oAuthRepository.findById("user2185c46f-832f-4d4a-8c52-a2f4e032d435").orElseThrow();
        Products products = productsfindRepository.findById("PROD_1767018610056").orElseThrow();

        Review review = new Review();
        review.setId(IdGenerator.reviewId());
        review.setTitle("댓글테스트1");
        review.setContent("이것은 리뷰테스트1111");
        review.setScore(5);
        review.setUser(user);
        review.setProducts(products);

        reviewRepository.save(review);
    }

    @Test
    void findReview(){
        Products products = productsfindRepository.findById("PROD_1767018610056").orElseThrow();

       List<Review> reviews = reviewRepository.findByProducts(products);

        System.out.println(reviews);
    }

    @Test
    void countByProducts_ProductsId(){
        int reviewCount = reviewRepository.countByProducts_ProductsId("PROD_1767018610056");
        System.out.println(reviewCount);
    }

    @Test
    void avgScoreByProductId(){
        Double reviewAvg = reviewRepository.avgScoreByProductId("PROD_1767018610056");
        System.out.println(reviewAvg);
    }


}