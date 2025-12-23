package com.example.demo.security.handler;


import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.util.JWTUtil;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Log4j2
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        log.info("-----------------");
        log.info("--onAuthenticationSuccess----");
        log.info(authentication);
        log.info("------------------");

        UserDTO userDTO = (UserDTO) authentication.getPrincipal();

        Map<String, Object> claims = userDTO.getClaims();

        String accessToken = JWTUtil.generateToken(claims, 10);
        String refreshToken = JWTUtil.generateToken(claims, 60 *24);

        claims.put("accessToken",accessToken);
        claims.put("refreshToken", refreshToken);
        log.info("accessToken : " + accessToken);
        log.info("refreshToken : " + refreshToken);

        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);
        response.setContentType("application/json; charset=UTF-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();

    }
}
