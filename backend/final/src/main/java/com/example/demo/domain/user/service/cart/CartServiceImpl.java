package com.example.demo.domain.user.service.cart;

import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.domain.user.repository.cart.CartRepository;
import com.example.demo.entity.Carts;
import com.example.demo.entity.User;
import com.example.demo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService{

    private final OAuthRepository oAuthRepository;
    private final CartRepository cartRepository;

    @Override
    public Carts findByUserId(String userId) {

        User user = oAuthRepository.findById(userId).orElseThrow();

        return  cartRepository.findByUser_UserId(user.getUserId())
                .orElseGet(() -> {
                    Carts newCart = Carts.builder()
                            .cartId(IdGenerator.cartId())
                            .user(user)
                            .build();
                    return cartRepository.save(newCart);
                });
    }
}
