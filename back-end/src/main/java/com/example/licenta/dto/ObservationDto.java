package com.example.licenta.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ObservationDto {

    private LocalDateTime date;
    private String species;
    private int noOfSpecimens;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
