package com.example.licenta.dto;

import com.example.licenta.enums.Rarity;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BirdDto {
    private String species;
    private Rarity rarity;
}
