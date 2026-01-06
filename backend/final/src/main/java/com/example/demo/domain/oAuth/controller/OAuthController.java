package com.example.demo.domain.oAuth.controller;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.oAuth.service.OAuthService;
import com.example.demo.util.JWTUtil;
import com.google.gson.Gson;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

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

    @PostMapping("/api/v1/oauth/login")
    public void oauthLogin(
            @RequestBody Map<String, String> request,
            HttpServletResponse response
    ) throws IOException {
        log.info("OAuth 로그인 요청: " + request);

        String provider = request.get("provider");
        String accessToken = request.get("accessToken");

        if (provider == null || accessToken == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json; charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.println(new Gson().toJson(Map.of("error", "provider와 accessToken이 필요합니다.")));
            writer.close();
            return;
        }

        try {
            UserDTO userDTO = null;

            if ("google".equals(provider)) {
                userDTO = oAuthService.getGoogleUser(accessToken);
            } else if ("kakao".equals(provider)) {
                userDTO = oAuthService.getkKakaoUser(accessToken);
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("application/json; charset=UTF-8");
                PrintWriter writer = response.getWriter();
                writer.println(new Gson().toJson(Map.of("error", "지원하지 않는 OAuth 제공자입니다.")));
                writer.close();
                return;
            }

            if (userDTO == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json; charset=UTF-8");
                PrintWriter writer = response.getWriter();
                writer.println(new Gson().toJson(Map.of("error", "사용자 정보를 가져올 수 없습니다.")));
                writer.close();
                return;
            }

            // JWT 토큰 생성 (일반 로그인과 동일한 방식)
            Map<String, Object> claims = userDTO.getClaims();
            String jwtAccessToken = JWTUtil.generateToken(claims, 10);
            String jwtRefreshToken = JWTUtil.generateToken(claims, 60 * 24);

            claims.put("accessToken", jwtAccessToken);
            claims.put("refreshToken", jwtRefreshToken);

            log.info("OAuth 로그인 성공 - accessToken: " + jwtAccessToken);
            log.info("OAuth 로그인 성공 - refreshToken: " + jwtRefreshToken);

            // 응답 반환
            response.setContentType("application/json; charset=UTF-8");
            PrintWriter printWriter = response.getWriter();
            printWriter.println(new Gson().toJson(claims));
            printWriter.close();

        } catch (Exception e) {
            log.error("OAuth 로그인 실패: " + e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json; charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.println(new Gson().toJson(Map.of("error", "OAuth 로그인 처리 중 오류가 발생했습니다: " + e.getMessage())));
            writer.close();
        }
    }
}
