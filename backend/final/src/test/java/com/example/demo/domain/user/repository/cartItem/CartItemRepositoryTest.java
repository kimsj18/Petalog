package com.example.demo.domain.user.repository.cartItem;

import com.example.demo.domain.user.DTO.CartItemListDTO;
import com.example.demo.domain.user.repository.ProductsfindRepository;
import com.example.demo.domain.user.repository.cart.CartRepository;
import com.example.demo.entity.CartItem;
import com.example.demo.entity.Carts;
import com.example.demo.entity.Products;
import com.example.demo.util.IdGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CartItemRepositoryTest {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductsfindRepository productsfindRepository;

    @Autowired
    DataSource dataSource;
//
//    @Test
//    void checkDb() throws Exception {
//        System.out.println(
//                dataSource.getConnection().getCatalog()
//        );
//    }    @Autowired
//    DataSource dataSource;
//
//    @Test
//    void checkDb() throws Exception {
//        System.out.println(
//                dataSource.getConnection().getCatalog()
//        );
//    }

    @Test
    void dbCheck() throws Exception {
        var con = dataSource.getConnection();
        System.out.println(con.getMetaData().getURL());
        System.out.println(con.getMetaData().getUserName());
    }

    @Test
    @Transactional
    @Rollback(false)
    void addOrUpdateItem(){
        int quantity = 8;


        String userId = "user9a24156f-e995-4f65-b487-cab0aabcdc83";
        Carts cart = cartRepository.findByUser_UserId(userId).orElseThrow();
//        System.out.println(cart);
        String productId = "PROD_1767018610056";
        Products product = productsfindRepository.findById(productId).orElseThrow();
//        System.out.println(product);

        Optional<CartItem> opcartItem = cartItemRepository.findByCarts_CartIdAndProducts_ProductsId(cart.getCartId(), productId);

        if(opcartItem.isPresent()){
            CartItem cartItem = opcartItem.get();
            cartItem.setQuantity(quantity);
        }else {
            CartItem cartItem = CartItem.builder()
                    .id(IdGenerator.cartItemId())
                    .carts(cart)
                    .products(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(cartItem);
        }
    }

    @Test
    @Transactional
    void findByCarts_CartId(){
        String userId = "user9a24156f-e995-4f65-b487-cab0aabcdc83";
        Carts cart = cartRepository.findByUser_UserId(userId).orElseThrow();
        System.out.println(cart.getCartId());
        List<CartItem> cartItems = cartItemRepository.findByCarts_CartId(cart.getCartId());

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
        System.out.println(cartItemListDTOS);
    }

    @Test
    @Transactional
    @Rollback(false)
    void updateQuantityByCartItemId(){
        String cartItemId = "cartItem-2664098966253117";
        int quantity = 20;
        cartItemRepository.updateQuantityByCartItemId(cartItemId, quantity);
    }

    @Test
    void deleteByCartItem(){
        String cartItemId= "cartItem-2664420665595043";
        cartItemRepository.deleteById(cartItemId);
    }

}