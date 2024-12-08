package com.example.licenta.dto;

import lombok.Data;

import java.util.List;

@Data
public class ComparisonDto {

    private String username;
    private List<BirdDto> birds;
    private int commonNo;
    private int uncommonNo;
    private int rareNo;
    private long totalScore;
}
