package com.example.licenta.service;

import com.example.licenta.dto.BirdSpeciesDto;
import com.example.licenta.dto.ObservationDataDto;
import com.example.licenta.dto.ObservationDto;
import com.example.licenta.filter.ObservationFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BirdService {
    List<ObservationDto> getFilteredBirds(ObservationFilter observationFilter);

    Page<BirdSpeciesDto> getTypes(Pageable page, String query);

    List<ObservationDataDto> getObservationDataFiltered(ObservationFilter observationFilter);
}
