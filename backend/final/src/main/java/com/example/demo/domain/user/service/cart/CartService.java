package com.example.demo.domain.user.service.cart;

import com.example.demo.entity.Carts;

import java.util.Optional;

public interface CartService {

    Carts findByUserId(String userId);


}
