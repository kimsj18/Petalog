package com.example.demo.domain.user.repository.cart;

import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.entity.Carts;
import com.example.demo.entity.User;
import com.example.demo.util.IdGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CartRepositoryTest {

    @Autowired
    private OAuthRepository oAuthRepository;

    @Autowired
    private CartRepository cartRepository;

    @Test
    void findUserId(){

        User user = oAuthRepository.findById("user9a24156f-e995-4f65-b487-cab0aabcdc83").orElseThrow();

        Optional<Carts> carts = cartRepository.findByUser_UserId(user.getUserId());

        Carts cart = carts.orElseGet(() -> {
            Carts newCart = Carts.builder()
                    .cartId(IdGenerator.cartId())
                    .user(user)
                    .build();
            return cartRepository.save(newCart);
        });

        assertNotNull(cart);
        assertEquals(user.getUserId(), cart.getUser().getUserId());
    }

}