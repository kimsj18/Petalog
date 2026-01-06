package com.example.demo.domain.user.address.repository;

import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.domain.user.address.dto.AddressDTO;
import com.example.demo.entity.User;
import com.example.demo.entity.UserAddress;
import com.example.demo.util.IdGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AddressRepositoryTest {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OAuthRepository oAuthRepository;

    @Test
    void addressSave(){
        String userId = "USR-2665651803248435";
        User user = oAuthRepository.findById(userId).orElseThrow();

         UserAddress userAddress = UserAddress.builder()
                .addressId(IdGenerator.addressId())
                .recipientName("라떼")
                .recipientPhone("01022223333")
                .zipcode("03242")
                .address1("강동구")
                .address2("111번지")
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

         addressRepository.save(userAddress);
    }

    @Test
    void findById(){
        String userId = "USR-2665651803248435";
        UserAddress userAddress = addressRepository.findByUser_userId(userId);
        AddressDTO addressDTO = new AddressDTO(
                userAddress.getAddressId(),
                userAddress.getRecipientName(),
                userAddress.getRecipientPhone(),
                userAddress.getZipcode(),
                userAddress.getAddress1(),
                userAddress.getAddress2(),
                userAddress.getCreatedAt()
        );
        System.out.println(addressDTO);
    }

}