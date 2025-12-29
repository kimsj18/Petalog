package com.example.demo.domain.user.repository;

import com.example.demo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, String > {


}
