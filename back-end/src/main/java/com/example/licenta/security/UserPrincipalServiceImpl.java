package com.example.licenta.security;


import com.example.licenta.entity.User;
import com.example.licenta.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserPrincipalServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(final String username) {
        try {
            User user = userRepository.getByUsername(username);
            return new UserPrincipal(user);
        } catch (EntityNotFoundException e) {
            throw new BadCredentialsException("Bad credentials");
        }
    }
}
