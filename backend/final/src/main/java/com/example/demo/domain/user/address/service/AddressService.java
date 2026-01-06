package com.example.demo.domain.user.address.service;

import com.example.demo.domain.user.address.dto.AddressDTO;

import java.util.Optional;

public interface AddressService {

    void addressSave(AddressDTO addressDTO, String userId);

    Optional<AddressDTO> findByUser_userId(String userId);

    void addressSaveOrUpdate(AddressDTO addressDTO, String userId);
}
