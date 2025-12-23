package com.example.demo.domain.oAuth.controller;

import com.example.demo.domain.oAuth.service.OAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Log4j2
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oAuthService;

    @GetMapping("/api/v1/oauth/kakao")
    public String[] getUesrFromKakao(String accessToken){

        log.info("access Token");
        log.info(accessToken);

        oAuthService.getkKakaoUser(accessToken);
        return new String[]{"aaa","bbb","ccc"};
    }
}
