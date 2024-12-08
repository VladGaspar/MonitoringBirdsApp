package com.example.licenta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDto {

    private String username;
    private String firstName;
    private String lastName;
    private Long noOfObservation;
    private Long distinctBirds;
}
