package com.example.demo.domain.user.service.cartItem;

import com.example.demo.domain.user.DTO.CartItemListDTO;
import com.example.demo.domain.user.repository.ProductsfindRepository;
import com.example.demo.domain.user.repository.cart.CartRepository;
import com.example.demo.domain.user.repository.cartItem.CartItemRepository;
import com.example.demo.domain.user.service.cart.CartService;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Carts;
import com.example.demo.entity.Products;
import com.example.demo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartItemServiceImpl implements CartItemService{

    private final CartRepository cartRepository;
    private final ProductsfindRepository productsfindRepository;
    private final CartItemRepository cartItemRepository;
    private final CartService cartService;

    @Override
    public void addOrUpdateItem(String userId, String productId, int quantity) {

        Carts cart = cartService.findByUserId(userId);
        Products product = productsfindRepository.findById(productId).orElseThrow();

        Optional<CartItem> cartItem = cartItemRepository.findByCarts_CartIdAndProducts_ProductsId(cart.getCartId(), productId);

        if(cartItem.isPresent()){
            CartItem cartItem1 = cartItem.get();
            cartItem1.setQuantity(quantity);
        }else {
            CartItem cartItem1 = CartItem.builder()
                    .id(IdGenerator.cartItemId())
                    .carts(cart)
                    .products(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(cartItem1);
        }

    }

    @Override
    public List<CartItemListDTO> findByCarts_CartId(String userId) {
        Carts cart = cartRepository.findByUser_UserId(userId).orElseThrow();
        // JOIN FETCH를 사용하여 Products를 함께 가져와 N+1 쿼리 문제 해결
        List<CartItem> cartItems = cartItemRepository.findByCarts_CartIdWithProducts(cart.getCartId());

        List<CartItemListDTO> cartItemListDTOS = cartItems.stream()
                .map(cartItem -> new CartItemListDTO(
                        cartItem.getId(),
                        cartItem.getProducts().getProductsId(),
                        cartItem.getProducts().getName(),
                        cartItem.getProducts().getPrice(),
                        cartItem.getQuantity(),
                        cartItem.getProducts().getBrand(),
                        cartItem.getProducts().getImageUrl()
                )).toList();
        return cartItemListDTOS;
    }

    @Override
    public void updateQuantityByCartItemId(String cartItemId, int quantity) {
        cartItemRepository.updateQuantityByCartItemId(cartItemId, quantity);

    }

    @Override
    public void deleteCartItem(String cartItemId) {
        cartItemRepository.deleteById(cartItemId);

    }
}
