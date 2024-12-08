package com.example.licenta.service;

import com.example.licenta.dto.ComparisonDto;
import com.example.licenta.dto.LeaderBoardUserDto;
import com.example.licenta.dto.UserInfoDto;
import com.example.licenta.dto.UserResponseDto;
import com.example.licenta.dto.auth.LoginDto;
import com.example.licenta.dto.auth.RegisterDto;
import com.example.licenta.dto.auth.RegisterResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto login(final LoginDto loginDto);

    RegisterResponseDto registerUser(RegisterDto registerDto);

    List<LeaderBoardUserDto> getLeaderBoard();

    ComparisonDto getComparisonUser(String username);

    ComparisonDto getLoggedUserComparison(int id);

    UserInfoDto getUserInfo(int loggedUserId);
}
