package com.example.demo.domain.oAuth.controller;

import com.example.demo.util.CustomJWTException;
import com.example.demo.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@Log4j2
@RequiredArgsConstructor
public class APIRefreshController {

    @PostMapping("/api/v1/refresh")
    public ResponseEntity<Map<String, Object>> refresh(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, String> requestBody
    ){

        try {
            String refreshToken = requestBody.get("refreshToken");
            log.info("리프레시토큰 요청 수신");
            
            // 리프레시 토큰 검증
            if(refreshToken == null || refreshToken.isEmpty()){
                log.warn("리프레시 토큰이 null이거나 비어있습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "NULL_REFRESH", "message", "리프레시 토큰이 필요합니다."));
            }
            
            // Authorization 헤더 검증
            if(authHeader == null || authHeader.length() < 7 || !authHeader.startsWith("Bearer ")){
                log.warn("Authorization 헤더가 유효하지 않습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "INVALID_HEADER", "message", "Authorization 헤더가 유효하지 않습니다."));
            }

            //Bearer xxxx
            String accessToken = authHeader.substring(7);

            //AccessToken의 만료여부 확인
            if(checkExpiredToken(accessToken) == false){
                log.info("액세스 토큰이 아직 유효합니다.");
                return ResponseEntity.ok(Map.of("accessToken", accessToken, "refreshToken", refreshToken));
            }

            //Refresh토큰 검증
            Map<String , Object> claims = JWTUtil.validateToken(refreshToken);
            log.info("refresh ... claims: " + claims);

            String newAccessToken = JWTUtil.generateToken(claims, 10);
            String newRefreshToken = checkTime((Long) claims.get("exp"))? 
                    JWTUtil.generateToken(claims, 60 * 24) : refreshToken;

            log.info("토큰 갱신 성공");
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken));
            
        } catch (CustomJWTException e) {
            log.error("JWT 검증 실패: " + e.getMessage());
            
            // CustomJWTException을 적절한 HTTP 상태 코드로 변환
            HttpStatus status;
            String message = e.getMessage();
            if ("Expired".equals(message)) {
                status = HttpStatus.UNAUTHORIZED;  // 401
            } else if ("MalFormed".equals(message) || "Invalid".equals(message)) {
                status = HttpStatus.BAD_REQUEST;  // 400
            } else {
                status = HttpStatus.UNAUTHORIZED;  // 401
            }
            
            return ResponseEntity.status(status)
                    .body(Map.of("error", e.getMessage(), "message", "토큰 검증에 실패했습니다."));
                    
        } catch (Exception e) {
            log.error("토큰 갱신 중 예외 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "INTERNAL_ERROR", "message", "서버 오류가 발생했습니다."));
        }
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
            return false;  // 만료되지 않음
        }catch (CustomJWTException ex){
            if("Expired".equals(ex.getMessage())){
                return true;  // 만료됨
            }
            // 다른 예외는 false 반환 (만료가 아닌 다른 문제)
            log.warn("토큰 검증 중 예외 발생 (만료 아님): " + ex.getMessage());
            return false;
        }catch (Exception e){
            log.error("토큰 검증 중 예상치 못한 예외 발생: ", e);
            return false;
        }
    }

}
