package com.example.demo.domain.oAuth.repository;

import com.example.demo.entity.User;
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
                .userId("user"+UUID.randomUUID().toString())
                .userEmail("bbb@bbb.com")
                .userName("bbb")
                .userPhone("01022223333")
                .userEnterDay(LocalDate.now())
                .userStatus(1)
                .userPassword(passwordEncoder.encode("1234"))
                .userRole("ADMIN")
                .build();

        oAuthRepository.save(user);
    }



}