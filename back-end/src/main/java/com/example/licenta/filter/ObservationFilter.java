package com.example.licenta.filter;

import com.example.licenta.PeriodType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ObservationFilter {
    private String species;
    private PeriodType periodType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer year;
    private Integer comparisonYear;
    private Integer observations;
}
