package com.example.licenta.service.impl;

import com.example.licenta.dto.*;
import com.example.licenta.dto.auth.LoginDto;
import com.example.licenta.dto.auth.RegisterDto;
import com.example.licenta.dto.auth.RegisterResponseDto;
import com.example.licenta.entity.Bird;
import com.example.licenta.entity.User;
import com.example.licenta.enums.RoleType;
import com.example.licenta.mapper.UserMapper;
import com.example.licenta.repository.BirdRepository;
import com.example.licenta.repository.UserRepository;
import com.example.licenta.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final BirdRepository birdRepository;

    @Override
    public UserResponseDto login(LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        final User user = userRepository.getByUsername(loginDto.getUsername());

        return userMapper.userToUserResponseDto(user);
    }

    @Override
    public RegisterResponseDto registerUser(RegisterDto registerDto) {

        registerDto.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        User user = userMapper.registerDtoToUser(registerDto);
        user.setRole(RoleType.USER);
        userRepository.save(user);

        return userMapper.userToRegisterResponseDto(user);
    }

    @Override
    public List<LeaderBoardUserDto> getLeaderBoard() {
        return userRepository.findTopUsersByPoints();
    }

    @Override
    public ComparisonDto getComparisonUser(String username) {
        validateUserExist(username);
        return getComparisonDto(username);
    }

    @Override
    public ComparisonDto getLoggedUserComparison(int id) {
        Optional<User> user = userRepository.findById(id);
        return getComparisonDto(user.get().getUsername());
    }

    @Override
    public UserInfoDto getUserInfo(int loggedUserId) {
        return userRepository.getUserInfoDto(loggedUserId);
    }

    public ComparisonDto getComparisonDto(String username) {
        List<Bird> distinctBirdsByUserId = birdRepository.findAllBirdsByUserId(username);
        List<BirdObservationDto> distinctBirdsIdByUserId = birdRepository.findAllBirdsIdByUserId(username);
        Long totalScore = userRepository.findScoreByUsername(username);
        int commonNo = 0;
        int rareNo = 0;
        int uncommonNo = 0;
        List<String> birdsSpecies = new ArrayList<>();

        for (BirdObservationDto b : distinctBirdsIdByUserId) {
            Bird bird = birdRepository.findById(b.getBirdId()).orElseThrow();
            switch (bird.getRarity()) {
                case UNCOMMON -> uncommonNo += b.getNoOfSpecimens();
                case RARE -> rareNo += b.getNoOfSpecimens();
                case COMMON -> commonNo += b.getNoOfSpecimens();
            }
            birdsSpecies.add(bird.getSpecies());
        }

        return userMapper.userToComparisonDto(username, commonNo, uncommonNo, rareNo, distinctBirdsByUserId, totalScore);
    }

    private void validateUserExist(String username) {
        userRepository.getByUsername(username);
    }

}
