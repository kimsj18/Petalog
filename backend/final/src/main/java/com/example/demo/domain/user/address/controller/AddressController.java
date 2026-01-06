package com.example.demo.domain.user.address.controller;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.user.address.dto.AddressDTO;
import com.example.demo.domain.user.address.service.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/v1/user")
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/address")
    public ResponseEntity<AddressDTO> userAddressGet(
            @AuthenticationPrincipal UserDTO userDTO
    ) {
        Optional<AddressDTO> addressDTO = addressService.findByUser_userId(userDTO.getUserId());
        
        if (addressDTO.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(addressDTO.get());
    }

    @PutMapping("/address")
    public void userAddressSaveOrUpdate(
            @AuthenticationPrincipal UserDTO userDTO,
            @RequestBody AddressDTO addressDTO
            ){
        addressService.addressSaveOrUpdate(addressDTO, userDTO.getUserId());
    }
}
