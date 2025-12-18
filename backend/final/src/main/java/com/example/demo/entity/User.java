package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(name = "user_id", length = 25, nullable = false)
    private String userId;

    @Column(name = "user_email", length = 50, nullable = false)
    private String userEmail;

    @Column(name = "user_name", length = 15, nullable = false)
    private String userName;

    @Column(name = "user_phone", length = 15, nullable = false)
    private String userPhone;

    @Column(name = "user_oauth_provider", length = 20, nullable = false)
    private String userOauthProvider;

    @Column(name = "user_oauth_id", length = 20, nullable = false)
    private String userOauthId;

    @Column(name = "user_enter_day", nullable = false)
    private LocalDate userEnterDay;

    @Column(name = "user_status", nullable = false)
    private int userStatus;

    @Column(name = "user_exit_day")
    private LocalDate userExitDay;

    @Column(name = "user_password")
    private String userPassword;



}
