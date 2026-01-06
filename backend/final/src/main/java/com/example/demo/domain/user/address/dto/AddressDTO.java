package com.example.demo.domain.user.address.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private String addressId;
    private String name;
    private String phone;
    private String zipcode;
    private String address1;
    private String address2;
    private LocalDateTime createdAt;
}
