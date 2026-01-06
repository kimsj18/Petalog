package com.example.demo.domain.user.controller.cartItem;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.user.DTO.CartItemListDTO;
import com.example.demo.domain.user.DTO.cartItemDTO;
import com.example.demo.domain.user.service.cartItem.CartItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/v1")
public class CartItemController {

    private final CartItemService cartItemService;

    @PostMapping("/products/{productId}/cart")
    public void addToCart(
            @AuthenticationPrincipal UserDTO userDTO,
            @PathVariable String productId,
            @RequestBody cartItemDTO cartItem
            ){
        log.info("Post cart");
        log.info(userDTO.getUserId());
        cartItemService.addOrUpdateItem(userDTO.getUserId(), productId, cartItem.getQuantity());
    }

    @GetMapping("/user/cart")
    public List<CartItemListDTO> findAllCart(@AuthenticationPrincipal UserDTO userDTO){
        return cartItemService.findByCarts_CartId(userDTO.getUserId());
    }

    @PutMapping("/user/cart/{cartItemId}")
    public void updateCartItemQuantity(
            @PathVariable String cartItemId,
            @RequestBody cartItemDTO cartItemDTO
    ){
        log.info("update cart item quantity: " +cartItemId );
        log.info("update cart item quantity: " + cartItemDTO.getQuantity() );
        cartItemService.updateQuantityByCartItemId(cartItemId,cartItemDTO.getQuantity());
    }

    @DeleteMapping("/user/cart/{cartItemId}/delete")
    public void deleteCartItem(
            @PathVariable  String cartItemId
    ){
        cartItemService.deleteCartItem(cartItemId);
    }
}
