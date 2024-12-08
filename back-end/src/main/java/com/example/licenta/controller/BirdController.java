package com.example.licenta.controller;

import com.example.licenta.dto.BirdSpeciesDto;
import com.example.licenta.dto.ObservationDataDto;
import com.example.licenta.dto.ObservationDto;
import com.example.licenta.filter.ObservationFilter;
import com.example.licenta.service.BirdService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/birds")
public class BirdController {

    private final BirdService birdService;

    @GetMapping
    public ResponseEntity<List<ObservationDto>> getFilteredBirds(
            @ModelAttribute ObservationFilter observationFilter) {
        return ResponseEntity.ok().body(birdService.getFilteredBirds(observationFilter));
    }

    @GetMapping("/observations")
    public ResponseEntity<List<ObservationDataDto>> getObservationData(
            @ModelAttribute ObservationFilter observationFilter) {
        return ResponseEntity.ok().body(birdService.getObservationDataFiltered(observationFilter));
    }

    @GetMapping("/types")
    public ResponseEntity<Page<BirdSpeciesDto>> getTypes(@PageableDefault(size = 40) Pageable pageable,
                                                         @RequestParam(name = "query", required = false) String query) {
        return ResponseEntity.ok().body(birdService.getTypes(pageable, query));
    }
}
