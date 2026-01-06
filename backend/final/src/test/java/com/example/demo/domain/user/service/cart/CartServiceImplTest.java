package com.example.demo.domain.user.service.cart;

import com.example.demo.entity.Carts;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CartServiceImplTest {

    @Autowired
    private CartService cartService;

    @Test
    void findByUserId(){

        Carts carts = cartService.findByUserId("user9a24156f-e995-4f65-b487-cab0aabcdc83");

        assertNotNull(carts);
        assertEquals("user9a24156f-e995-4f65-b487-cab0aabcdc83", carts.getUser().getUserId());
    }

}