package com.example.demo.domain.oAuth.controller;

import com.example.demo.util.CustomJWTException;
import com.example.demo.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;

@RestController
@Log4j2
@RequiredArgsConstructor
public class APIRefreshController {

    @RequestMapping("/api/v1/refresh")
    public Map<String, Object> refresh(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> requestBody
    ){
        String refreshToken = requestBody.get("refreshToken");
        log.info("리프레시토큰: " + refreshToken);
        if(refreshToken == null){
            throw new CustomJWTException("NULL_REFRESH");
        }
        if(authHeader == null || authHeader.length() < 7){
            throw new CustomJWTException("IMVALID STRING");
        }

        //Bearer xxxx
        String accessToken = authHeader.substring(7);

        //AccessToken의 만료여부 확인
        if(checkExpiredToken(accessToken) == false){
            return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
        }

        //Refresh토큰 검증
        Map<String , Object> claims = JWTUtil.validateToken(refreshToken);
        log.info("refresh ... claims: " + claims);

        String newAccessToken = JWTUtil.generateToken(claims, 10);
        String newRefreshToken = checkTime((Long) claims.get("exp"))? JWTUtil.generateToken(claims, 60 * 24) : refreshToken;

        return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
    }

    //시간이 1시간 미만으로 남았다면
    private boolean checkTime(Long exp){

        //JWT exp를 날짜로 변환
         java.util.Date expDate = new Date((long) exp * (1000));

         //현재 시간과의 차이 계산
        long gap = expDate.getTime() - System.currentTimeMillis();

        //분단위 계산
        long leftMin = gap/(1000 * 60);

        //1시간도 안남았는지
        return leftMin < 60;
    }

    private boolean checkExpiredToken(String token){

        try{
            JWTUtil.validateToken(token);
        }catch (CustomJWTException ex){
            if(ex.getMessage().equals("Expired")){
                return true;
            }
        }
        return false;
    }

}
