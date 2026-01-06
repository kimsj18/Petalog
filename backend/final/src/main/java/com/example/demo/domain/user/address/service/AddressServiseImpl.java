package com.example.demo.domain.user.address.service;

import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.domain.user.address.dto.AddressDTO;
import com.example.demo.domain.user.address.repository.AddressRepository;
import com.example.demo.entity.User;
import com.example.demo.entity.UserAddress;
import com.example.demo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressServiseImpl implements AddressService{

    private final AddressRepository addressRepository;
    private final OAuthRepository oAuthRepository;

    @Override
    public void addressSave(AddressDTO addressDTO, String userId) {
        User user = oAuthRepository.findById(userId).orElseThrow();

        UserAddress userAddress = UserAddress.builder()
                .addressId(IdGenerator.addressId())
                .recipientName(addressDTO.getName())
                .recipientPhone(addressDTO.getPhone())
                .zipcode(addressDTO.getZipcode())
                .address1(addressDTO.getAddress1())
                .address2(addressDTO.getAddress2())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        addressRepository.save(userAddress);

    }

    @Override
    public Optional<AddressDTO> findByUser_userId(String userId) {
        UserAddress userAddress = addressRepository.findByUser_userId(userId);
        
        if (userAddress == null) {
            return Optional.empty();
        }
        
        AddressDTO dto = new AddressDTO();
        dto.setAddressId(userAddress.getAddressId());
        dto.setName(userAddress.getRecipientName());
        dto.setPhone(userAddress.getRecipientPhone());
        dto.setZipcode(userAddress.getZipcode());
        dto.setAddress1(userAddress.getAddress1());
        dto.setAddress2(userAddress.getAddress2());
        dto.setCreatedAt(userAddress.getCreatedAt());
        
        return Optional.of(dto);
    }

    @Override
    public void addressSaveOrUpdate(AddressDTO addressDTO, String userId) {
        User user = oAuthRepository.findById(userId).orElseThrow();
        
        // 기존 주소 조회
        UserAddress existingAddress = addressRepository.findByUser_userId(userId);
        
        UserAddress userAddress;
        
        if (existingAddress != null) {
            // 기존 주소가 있으면 수정
            userAddress = UserAddress.builder()
                    .addressId(existingAddress.getAddressId())
                    .recipientName(addressDTO.getName())
                    .recipientPhone(addressDTO.getPhone())
                    .zipcode(addressDTO.getZipcode())
                    .address1(addressDTO.getAddress1())
                    .address2(addressDTO.getAddress2())
                    .isDefault(existingAddress.getIsDefault())
                    .createdAt(existingAddress.getCreatedAt())
                    .user(user)
                    .build();
        } else {
            // 기존 주소가 없으면 등록
            userAddress = UserAddress.builder()
                    .addressId(IdGenerator.addressId())
                    .recipientName(addressDTO.getName())
                    .recipientPhone(addressDTO.getPhone())
                    .zipcode(addressDTO.getZipcode())
                    .address1(addressDTO.getAddress1())
                    .address2(addressDTO.getAddress2())
                    .createdAt(LocalDateTime.now())
                    .user(user)
                    .build();
        }
        
        addressRepository.save(userAddress);
    }
}
