package com.example.demo.domain.oAuth.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDate;
import java.util.*;

public class UserDTO extends User {

    private String email;
    private String password;
    private String name;
    private String Phone;
    private String userOauthProvider;
    private String userOauthId;
    private LocalDate userEnterDay;
    private int userStatus;
    private LocalDate userExitDay;
    private String userPassword;
    private String userRole;

    public UserDTO(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    public UserDTO(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    }

    public UserDTO(String userEmail, String userPassword, String userId, String userName,
                   String userOauthId, String userOauthProvider, String userPhone, String userRole) {
        super(userEmail, userPassword != null ? userPassword : "",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userRole)));
        this.email = userEmail;
        this.password = userPassword;
        this.name = userName;
        this.Phone = userPhone;
        this.userOauthProvider = userOauthProvider;
        this.userOauthId = userOauthId;
        this.userRole = userRole;
    }

    public Map<String, Object> getClaims() {

        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("email", email);
        dataMap.put("password", password);
        dataMap.put("name", name);
        dataMap.put("userRole", userRole);

        return dataMap;
    }
}
