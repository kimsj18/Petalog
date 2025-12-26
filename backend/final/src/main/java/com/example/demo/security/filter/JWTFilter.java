package com.example.demo.security.filter;

import com.example.demo.util.JWTUtil;
import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@Log4j2
public class JWTFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        String path = request.getRequestURI();
        log.info("check out------" + path);

        if(path.startsWith("/api/v1/login")){
            return true;
        }

        if(path.startsWith("/api/v1/refresh")){
            return true;
        }

        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("JWTFilter 진입");
        log.info("Authorization = {}", request.getHeader("Authorization"));
        log.info("Authentication = {}",
                SecurityContextHolder.getContext().getAuthentication());
        log.info("--------------------");


        log.info("--------------------");


        log.info("--------------------");
        String path = request.getRequestURI();

        // ⭐ 이미지 요청은 JWT 검사 안 함
        if (path.startsWith("/uploads/")) {
            filterChain.doFilter(request, response);
            return;
        }
        String authHeaderStr = request.getHeader("Authorization");


        // Bearer //7 JWT문자열
        try {
            // null 체크 및 Bearer 토큰 형식 검증
            if (authHeaderStr == null || !authHeaderStr.startsWith("Bearer ") || authHeaderStr.length() <= 7) {
                throw new IllegalArgumentException("Invalid or missing Authorization header");
            }
            
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            log.info(claims);

            String email = (String) claims.get("email");
            String role = (String) claims.get("userRole");

            List<GrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + role));

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(email, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 확인
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            log.info("authorities = {}", auth.getAuthorities());


            filterChain.doFilter(request, response);
        }catch (Exception e){
            log.info("JWT Check Error------------");
            log.info(e.getMessage());

            Gson gson = new Gson();
            String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));

            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 상태 코드 추가
            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }
    }
}
