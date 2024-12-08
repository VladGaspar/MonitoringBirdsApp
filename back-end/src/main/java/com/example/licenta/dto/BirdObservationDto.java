package com.example.licenta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BirdObservationDto {
    private int birdId;
    private int noOfSpecimens;
}
