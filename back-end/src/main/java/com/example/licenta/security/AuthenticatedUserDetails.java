package com.example.licenta.security;


import com.example.licenta.enums.RoleType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthenticatedUserDetails {

    private int id;
    private RoleType roleTypes;
    private String username;
}
