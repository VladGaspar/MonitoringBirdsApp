package com.example.licenta.dto;


import com.example.licenta.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private int id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private RoleType role;
}
