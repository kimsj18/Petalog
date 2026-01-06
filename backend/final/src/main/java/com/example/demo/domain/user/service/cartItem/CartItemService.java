package com.example.demo.domain.user.service.cartItem;

import com.example.demo.domain.user.DTO.CartItemListDTO;

import java.util.List;

public interface CartItemService {

    void addOrUpdateItem(String userId, String productId, int quantity);

    List<CartItemListDTO> findByCarts_CartId(String userId);

    void updateQuantityByCartItemId(String cartItemId, int quantity);

    void deleteCartItem(String cartItemId);
}
