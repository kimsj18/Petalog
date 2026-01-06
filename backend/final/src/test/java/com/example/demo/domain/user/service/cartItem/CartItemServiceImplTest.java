package com.example.demo.domain.user.service.cartItem;

import com.example.demo.domain.user.DTO.CartItemListDTO;
import com.example.demo.domain.user.repository.cartItem.CartItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CartItemServiceImplTest {

    @Autowired
    private CartItemService cartItemService;

    @Test
    void addOrUpdateItem(){
        cartItemService.addOrUpdateItem("user9a24156f-e995-4f65-b487-cab0aabcdc83", "PROD_1767018610056", 4);
    }

    @Test
    void findByCarts_CartId(){
        String userId = "user9a24156f-e995-4f65-b487-cab0aabcdc83";
        List<CartItemListDTO> cartItemListDTOS = cartItemService.findByCarts_CartId(userId);
        System.out.println(cartItemListDTOS);
    }

    @Test
    void updateQuantityByCartItemId(){
        String cartItemId = "cartItem-2663832576652779";
        int quantity = 199;
        cartItemService.updateQuantityByCartItemId(cartItemId, quantity);
    }

}