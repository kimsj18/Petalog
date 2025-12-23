package com.example.demo.security;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Log4j2
public class CustomUserDetailsService implements UserDetailsService {

    private final OAuthRepository oAuthRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        log.info("----------------loadUserByUsername--------------" + username);

        User user = oAuthRepository.getUserRole(username);

        if(user == null){
            throw new UsernameNotFoundException("Not Found" + username);
        }

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
        log.info(userDTO);

        return userDTO;
    }
}
