package com.example.licenta.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ObservationDataDto {

    private BigDecimal latitude;
    private BigDecimal longitude;
    private LocalDate date;
}
