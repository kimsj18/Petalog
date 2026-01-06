package com.example.demo.domain.user.repository.cartItem;

import com.example.demo.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, String > {

    Optional<CartItem> findByCarts_CartIdAndProducts_ProductsId(String cartId, String productId);

    List<CartItem> findByCarts_CartId(String cartId);

    @Modifying(clearAutomatically = true)
    @Query("update CartItem c SET c.quantity = :quantity WHERE c.id = :cartItemId")
    void updateQuantityByCartItemId(@Param("cartItemId") String cartItemId, @Param("quantity") int quantity);


}
