package com.example.licenta.controller;

import com.example.licenta.cloud.report.ReportService;
import com.example.licenta.dto.ComparisonDto;
import com.example.licenta.dto.LeaderBoardUserDto;
import com.example.licenta.dto.UserInfoDto;
import com.example.licenta.security.SecurityContextHolderAdapter;
import com.example.licenta.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/birds")
public class UserController {

    private final UserService userService;
    private final ReportService reportService;

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderBoardUserDto>> getLeaderBoard() {
        return ResponseEntity.ok().body(userService.getLeaderBoard());
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/compareUsers")
    public ResponseEntity<ComparisonDto> getComparisonUser(final @Valid @RequestParam("username") String username) {
        return ResponseEntity.ok().body(userService.getComparisonUser(username));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/compareMe")
    ResponseEntity<ComparisonDto> getLoggedUserStatus() {
        return ResponseEntity.ok().body(userService.getLoggedUserComparison(SecurityContextHolderAdapter.getLoggedUserId()));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/download")
    public ResponseEntity<String> downloadUsersReport() {
        return ResponseEntity.ok().body(
                reportService.getUsersReport(SecurityContextHolderAdapter.getLoggedUserId()));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user-info")
    public ResponseEntity<UserInfoDto> getUserInfo() {
        return ResponseEntity.ok().body(
                userService.getUserInfo(SecurityContextHolderAdapter.getLoggedUserId()));
    }
}
