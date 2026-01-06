package com.example.demo.domain.user.address.repository;

import com.example.demo.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<UserAddress, String > {

    UserAddress findByUser_userId(String userId);
}
