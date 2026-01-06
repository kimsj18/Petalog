package com.example.demo.domain.user.address.service;

import com.example.demo.domain.user.address.repository.AddressRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AddressServiceTest {

    @Autowired
    private AddressRepository addressRepository;

    @Test
    void addressSave(){

    }

}