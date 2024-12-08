package com.example.licenta.cloud.report;

import com.example.licenta.dto.ExportableDto;
import com.example.licenta.enums.Rarity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObservationReportDto implements ExportableDto {

    private String birdSpecies;
    private Rarity rarity;
    private int numberOfSpecimens;
    private LocalDate date;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public static List<String> getExportHeaders() {
        return List.of(
                "Bird Species", "Rarity", "Number of specimens", "Date", "Latitude", "Longitude"
        );
    }

    @Override
    public List<String> getValuesForExport() {
        return List.of(
                String.valueOf(this.getBirdSpecies()),
                String.valueOf(this.getRarity()),
                String.valueOf(this.getNumberOfSpecimens()),
                String.valueOf(this.getDate()),
                String.valueOf(this.getLatitude()),
                String.valueOf(this.getLongitude())
        );
    }
}