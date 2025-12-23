package com.example.demo.domain.oAuth.service;

import com.example.demo.domain.oAuth.dto.UserDTO;

public interface OAuthService {
    UserDTO getkKakaoUser(String accessToken);
}
