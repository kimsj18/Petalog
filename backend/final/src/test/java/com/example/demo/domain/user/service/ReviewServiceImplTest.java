package com.example.demo.domain.user.service;

import com.example.demo.domain.user.DTO.ReviewSummaryDTO;
import com.example.demo.domain.user.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ReviewServiceImplTest {

    @Autowired
    private ReviewService reviewService ;

    @Test
    void reviewSummaryFind(){
        ReviewSummaryDTO dto = reviewService.reviewSummaryFind("PROD_1767018610056");
        System.out.println(dto);
    }

}