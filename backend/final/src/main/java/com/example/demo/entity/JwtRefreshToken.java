package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "jwt_refresh_token")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtRefreshToken {

    @Id
    @Column(name = "jwt_id", length = 25)
    private String jwtId;

    @Column(name = "refresh_token", columnDefinition = "LONGTEXT")
    private String refreshToken;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
