package com.example.demo.domain.oAuth.service;

import com.example.demo.domain.oAuth.dto.UserDTO;
import lombok.extern.java.Log;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;

@Service
@Transactional
@Log4j2
public class OAuthServiceImpl implements OAuthService{
    @Override
    public UserDTO getkKakaoUser(String accessToken) {

        String email = getEmailFromKakaoAccessToken(accessToken);
        log.info("email: "+email);
        return null;
    }

    private String getEmailFromKakaoAccessToken(String accessToken){

        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if(accessToken == null){
            throw new RuntimeException("Access Token is null");
        }
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer" + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();

        ResponseEntity<LinkedHashMap> response
                = restTemplate.exchange(uriBuilder.toString(), HttpMethod.GET, entity, LinkedHashMap.class);

        log.info(response);

        LinkedHashMap<String , LinkedHashMap> bodyMap = response.getBody();

        log.info("----------------");
        log.info("bodyMap : " + bodyMap);

        return null;
    }
}
