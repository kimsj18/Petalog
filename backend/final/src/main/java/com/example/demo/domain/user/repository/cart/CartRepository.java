package com.example.demo.domain.user.repository.cart;

import com.example.demo.entity.Carts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Carts, String> {

    Optional<Carts> findByUser_UserId(String userId);

}
