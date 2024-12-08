package com.example.licenta.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;

import static java.util.Optional.ofNullable;

public class SecurityContextHolderAdapter {

    public static AuthenticatedUserDetails getLoggedInUser() throws AuthenticationException {
        return (AuthenticatedUserDetails) ofNullable(
                SecurityContextHolder.getContext().getAuthentication())
                .map(Authentication::getPrincipal)
                .orElseThrow(() -> new AuthenticationException("Authentication not found") {
                });
    }

    public static int getLoggedUserId() {
        return getLoggedInUser().getId();
    }

}
