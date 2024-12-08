package com.example.licenta.security;

import com.example.licenta.dto.UserResponseDto;
import com.example.licenta.enums.RoleType;
import com.example.licenta.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
public class JwtTokenProvider {

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String AUTH = "auth";
    public static final String USER_ID = "userId";
    private final Duration validityTime;
    private final SecretKey key;
    private final String issuer;

    public JwtTokenProvider(@Value("${auth.jwt.validityTime.days}") long validityTime,
                            @Value("${auth.jwt.key}") String secretKey, @Value("${auth.jwt.issuer}") String issuer,
                            UserRepository userRepository) {
        this.validityTime = Duration.ofDays(validityTime);
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.issuer = issuer;
    }

    public String createAuthToken(final UserResponseDto userResponseDto) {

        final Claims claims = Jwts.claims()
                .add(AUTH, userResponseDto.getRole())
                .add(USER_ID, userResponseDto.getId())
                .subject(userResponseDto.getUsername())
                .build();
        final LocalDateTime now = LocalDateTime.now();
        final LocalDateTime validity = LocalDateTime.now().plus(validityTime);

        return Jwts.builder()
                .claims(claims)
                .issuedAt(java.sql.Timestamp.valueOf(now))
                .expiration(java.sql.Timestamp.valueOf(validity))
                .signWith(key, SIG.HS256)
                .compact();
    }

    public String createEmailConfirmationToken(String username) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + validityTime.toMillis());

        return Jwts.builder()
                .issuer(issuer)
                .subject(username)
                .issuedAt(now)
                .expiration(expirationDate)
                .id(UUID.randomUUID().toString())
                .signWith(key, SIG.HS256)
                .compact();
    }

    public String getUsername(final String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (ExpiredJwtException ex) {
            return ex.getClaims().getSubject();
        }
    }

    public AuthenticatedUserDetails getAuthenticatedUserDetails(final String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return getAuthenticatedUserDetails(claims);
        } catch (ExpiredJwtException ex) {
            Claims claims = ex.getClaims();

            return getAuthenticatedUserDetails(claims);
        }
    }

    private AuthenticatedUserDetails getAuthenticatedUserDetails(Claims claims) {
        int userId = claims.get(USER_ID, Integer.class);
        String roleName = claims.get(AUTH, String.class);
        RoleType roleType = RoleType.valueOf(roleName);

        String username = claims.getSubject();

        return AuthenticatedUserDetails.builder()
                .id(userId)
                .roleTypes(roleType)
                .username(username)
                .build();
    }

    public String resolveAuthToken(final HttpServletRequest request) {
        final String bearerToken = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (null != bearerToken && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(7);
        }

        return null;
    }

    public boolean validateToken(final String token) {
        if (token == null) {
            return false;
        }

        Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return true;
    }

    public UsernamePasswordAuthenticationToken getAuthentication(final String token) {
        final AuthenticatedUserDetails authenticatedUser = getAuthenticatedUserDetails(token);
        final List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(authenticatedUser.getRoleTypes().getAuthority()));

        return new UsernamePasswordAuthenticationToken(authenticatedUser, "", authorities);
    }
}
