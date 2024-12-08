package com.example.licenta.dto.auth;

import com.example.licenta.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponseDto {

    private int id;
    private String firstName;
    private String lastName;
    private String username;
    private RoleType role;

}
