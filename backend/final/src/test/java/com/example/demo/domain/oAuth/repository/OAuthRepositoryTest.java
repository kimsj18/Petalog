package com.example.demo.domain.oAuth.repository;

import com.example.demo.entity.User;
import com.example.demo.util.IdGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.UUID;


@SpringBootTest

class OAuthRepositoryTest {

    @Autowired
    private OAuthRepository oAuthRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void InsertUserTest(){

        User user = User.builder()
                .userId(IdGenerator.userId())
                .userEmail("admin123")
                .userName("관리자")
                .userPhone("01012341234")
                .userEnterDay(LocalDate.now())
                .userStatus(1)
                .userPassword(passwordEncoder.encode("admin123"))
                .userRole("ADMIN")
                .build();

        oAuthRepository.save(user);
    }



}