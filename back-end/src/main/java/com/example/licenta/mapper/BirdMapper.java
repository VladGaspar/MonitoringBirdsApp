package com.example.licenta.mapper;

import com.example.licenta.dto.BirdDto;
import com.example.licenta.dto.BirdSpeciesDto;
import com.example.licenta.dto.ObservationDataDto;
import com.example.licenta.dto.ObservationDto;
import com.example.licenta.entity.Bird;
import com.example.licenta.entity.Observation;
import org.mapstruct.Mapper;

import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(componentModel = "spring", unmappedTargetPolicy = IGNORE)
public interface BirdMapper {

    ObservationDto toObservationDto(Observation observation);

    ObservationDataDto toObservationDataDto(Observation observation);

    BirdDto toBirdDto(Bird bird);

    BirdSpeciesDto toBirdSpeciesDto(Bird bird);
}
