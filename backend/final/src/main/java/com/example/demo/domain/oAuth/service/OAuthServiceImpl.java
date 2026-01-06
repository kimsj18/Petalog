package com.example.demo.domain.oAuth.service;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.entity.User;
import com.example.demo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
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

import java.time.LocalDate;
import java.util.LinkedHashMap;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class OAuthServiceImpl implements OAuthService{

    private final OAuthRepository oAuthRepository;

    @Override
    public UserDTO getkKakaoUser(String accessToken) {

        String email = getEmailFromKakaoAccessToken(accessToken);
        log.info("email: "+email);
        return null;
    }

    @Override
    public UserDTO getGoogleUser(String accessToken) {
        try {
            // Google API로 사용자 정보 조회
            String googleGetUserURL = "https://www.googleapis.com/oauth2/v2/userinfo";

            if (accessToken == null) {
                throw new RuntimeException("Access Token is null");
            }

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(googleGetUserURL).build();

            ResponseEntity<LinkedHashMap> response = restTemplate.exchange(
                    uriBuilder.toString(),
                    HttpMethod.GET,
                    entity,
                    LinkedHashMap.class
            );

            log.info("Google API 응답: " + response.getBody());

            LinkedHashMap<String, Object> bodyMap = response.getBody();
            if (bodyMap == null) {
                throw new RuntimeException("Google API 응답이 null입니다.");
            }

            String email = (String) bodyMap.get("email");
            String name = (String) bodyMap.get("name");
            String googleId = (String) bodyMap.get("id");

            log.info("Google 사용자 정보 - email: " + email + ", name: " + name + ", id: " + googleId);

            // DB에서 사용자 조회 (oauth_provider와 oauth_id로)
            User user = oAuthRepository.findAll()
                    .stream()
                    .filter(u -> "google".equals(u.getUserOauthProvider()) && googleId.equals(u.getUserOauthId()))
                    .findFirst()
                    .orElse(null);

            // 사용자가 없으면 새로 생성
            if (user == null) {
                // 이메일로도 확인 (기존 사용자가 일반 회원가입으로 가입한 경우)
                try {
                    User existingUser = oAuthRepository.getUserRole(email);
                    if (existingUser != null) {
                        // 기존 사용자에 OAuth 정보 추가
                        existingUser.setUserOauthProvider("google");
                        existingUser.setUserOauthId(googleId);
                        user = oAuthRepository.save(existingUser);
                    }
                } catch (Exception e) {
                    log.info("기존 사용자 없음, 새 사용자 생성");
                }

                if (user == null) {
                    // 새 사용자 생성
                    String userId = IdGenerator.userId();
                    user = User.builder()
                            .userId(userId)
                            .userEmail(email)
                            .userName(name != null ? name : email.split("@")[0])
                            .userPhone("") // OAuth 사용자는 전화번호 없음
                            .userOauthProvider("google")
                            .userOauthId(googleId)
                            .userEnterDay(LocalDate.now())
                            .userStatus(1)
                            .userRole("USER")
                            .build();

                    user = oAuthRepository.save(user);
                    log.info("새 Google 사용자 생성: " + user.getUserId());
                }
            }

            // UserDTO 생성 및 반환
            UserDTO userDTO = new UserDTO(
                    user.getUserEmail(),
                    user.getUserPassword(),
                    user.getUserId(),
                    user.getUserName(),
                    user.getUserOauthId(),
                    user.getUserOauthProvider(),
                    user.getUserPhone(),
                    user.getUserRole()
            );

            return userDTO;

        } catch (Exception e) {
            log.error("Google 사용자 정보 조회 실패: " + e.getMessage(), e);
            throw new RuntimeException("Google 사용자 정보 조회 실패: " + e.getMessage());
        }
    }



    private String getEmailFromKakaoAccessToken(String accessToken){

        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if(accessToken == null){
            throw new RuntimeException("Access Token is null");
        }
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
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
