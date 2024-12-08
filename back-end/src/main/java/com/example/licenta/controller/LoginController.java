package com.example.licenta.controller;

import com.example.licenta.dto.UserResponseDto;
import com.example.licenta.dto.auth.LoginDto;
import com.example.licenta.dto.auth.RegisterDto;
import com.example.licenta.dto.auth.RegisterResponseDto;
import com.example.licenta.security.JwtTokenProvider;
import com.example.licenta.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.licenta.security.JwtTokenProvider.TOKEN_PREFIX;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/birds")
public class LoginController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<UserResponseDto> login(final @Valid @RequestBody LoginDto loginDto) {
        UserResponseDto userResponseDto = userService.login(loginDto);
        String jwtToken = jwtTokenProvider.createAuthToken(userResponseDto);

        return ResponseEntity.ok().header(HttpHeaders.AUTHORIZATION, TOKEN_PREFIX + jwtToken)
                .body(userResponseDto);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto> registerUser(
            final @RequestBody @Valid RegisterDto registerDto) {
        RegisterResponseDto registerResponseDto = userService.registerUser(registerDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registerResponseDto);
    }

}
