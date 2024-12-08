package com.example.licenta.unit;

import com.example.licenta.dto.ComparisonDto;
import com.example.licenta.dto.LeaderBoardUserDto;
import com.example.licenta.dto.UserInfoDto;
import com.example.licenta.dto.UserResponseDto;
import com.example.licenta.dto.auth.LoginDto;
import com.example.licenta.dto.auth.RegisterDto;
import com.example.licenta.dto.auth.RegisterResponseDto;
import com.example.licenta.entity.Bird;
import com.example.licenta.entity.User;
import com.example.licenta.enums.Rarity;
import com.example.licenta.enums.RoleType;
import com.example.licenta.mapper.UserMapper;
import com.example.licenta.repository.BirdRepository;
import com.example.licenta.repository.UserRepository;
import com.example.licenta.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class UserServiceUnit {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private BirdRepository birdRepository;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_ShouldReturnUserResponseDto() {
        LoginDto loginDto = new LoginDto();
        loginDto.setUsername("testuser");
        loginDto.setPassword("password");

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = new User();
        when(userRepository.getByUsername(loginDto.getUsername())).thenReturn(user);

        UserResponseDto userResponseDto = new UserResponseDto();
        when(userMapper.userToUserResponseDto(user)).thenReturn(userResponseDto);

        UserResponseDto result = userService.login(loginDto);

        assertEquals(userResponseDto, result);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).getByUsername(loginDto.getUsername());
        verify(userMapper).userToUserResponseDto(user);
    }

    @Test
    void registerUser_ShouldReturnRegisterResponseDto() {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setUsername("testuser");
        registerDto.setPassword("password");

        User user = new User();
        when(passwordEncoder.encode(registerDto.getPassword())).thenReturn("encodedPassword");
        when(userMapper.registerDtoToUser(registerDto)).thenReturn(user);
        when(userRepository.save(user)).thenReturn(user);

        RegisterResponseDto registerResponseDto = new RegisterResponseDto();
        when(userMapper.userToRegisterResponseDto(user)).thenReturn(registerResponseDto);

        RegisterResponseDto result = userService.registerUser(registerDto);

        assertEquals(registerResponseDto, result);
        assertEquals(RoleType.USER, user.getRole());
        verify(userMapper).registerDtoToUser(registerDto);
        verify(userRepository).save(user);
        verify(userMapper).userToRegisterResponseDto(user);
    }

    @Test
    void getLeaderBoard_ShouldReturnLeaderBoardUserDtoList() {
        List<LeaderBoardUserDto> leaderBoardUserDtos = List.of(new LeaderBoardUserDto());
        when(userRepository.findTopUsersByPoints()).thenReturn(leaderBoardUserDtos);

        List<LeaderBoardUserDto> result = userService.getLeaderBoard();

        assertEquals(leaderBoardUserDtos, result);
        verify(userRepository).findTopUsersByPoints();
    }

    @Test
    void getComparisonUser_ShouldReturnComparisonDto() {
        String username = "testuser";
        when(userRepository.getByUsername(username)).thenReturn(any());

        ComparisonDto comparisonDto = new ComparisonDto();
        when(userService.getComparisonDto(username)).thenReturn(comparisonDto);

        ComparisonDto result = userService.getComparisonUser(username);

        assertEquals(comparisonDto, result);
        verify(userRepository).getByUsername(username);
    }

    @Test
    void getLoggedUserComparison_ShouldReturnComparisonDto() {
        int userId = 1;
        User user = new User();
        user.setUsername("testuser");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        ComparisonDto comparisonDto = new ComparisonDto();
        when(userService.getComparisonDto(user.getUsername())).thenReturn(comparisonDto);

        ComparisonDto result = userService.getLoggedUserComparison(userId);

        assertEquals(comparisonDto, result);
        verify(userRepository).findById(userId);
    }

    @Test
    void getUserInfo_ShouldReturnUserInfoDto() {
        int userId = 1;
        UserInfoDto userInfoDto = new UserInfoDto();
        when(userRepository.getUserInfoDto(userId)).thenReturn(userInfoDto);

        UserInfoDto result = userService.getUserInfo(userId);

        assertEquals(userInfoDto, result);
        verify(userRepository).getUserInfoDto(userId);
    }

    @Test
    public void testGetComparisonDto() {
        String username = "testUser";
        Bird commonBird = new Bird();
        commonBird.setRarity(Rarity.COMMON);
        commonBird.setSpecies("Common Species");

        Bird uncommonBird = new Bird();
        uncommonBird.setRarity(Rarity.UNCOMMON);
        uncommonBird.setSpecies("Uncommon Species");

        Bird rareBird = new Bird();
        rareBird.setRarity(Rarity.RARE);
        rareBird.setSpecies("Rare Species");

        when(birdRepository.findById(1)).thenReturn(Optional.of(commonBird));
        when(birdRepository.findById(2)).thenReturn(Optional.of(uncommonBird));
        when(birdRepository.findById(3)).thenReturn(Optional.of(rareBird));
        when(userRepository.findScoreByUsername(anyString())).thenReturn(100L);
        when(userMapper.userToComparisonDto(anyString(), anyInt(), anyInt(), anyInt(), any(), anyLong()))
                .thenReturn(new ComparisonDto());

        ComparisonDto comparisonDto = userService.getComparisonDto(username);

        assertEquals(0, comparisonDto.getCommonNo());
        assertEquals(0, comparisonDto.getUncommonNo());
        assertEquals(0, comparisonDto.getRareNo());
    }

}
