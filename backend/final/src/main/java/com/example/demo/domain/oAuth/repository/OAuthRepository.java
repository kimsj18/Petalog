package com.example.demo.domain.oAuth.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OAuthRepository extends JpaRepository<User, String > {


    @Query("select u from User u where u.userEmail = :userEmail ")
    User getUserRole(@Param("userEmail") String userEmail);

//    Optional<User> findAllByUserEmail(String userEmail);
}
