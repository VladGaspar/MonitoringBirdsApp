package com.example.licenta.service.impl;

import com.example.licenta.dto.BirdSpeciesDto;
import com.example.licenta.dto.ObservationDataDto;
import com.example.licenta.dto.ObservationDto;
import com.example.licenta.entity.Observation;
import com.example.licenta.filter.BirdFilter;
import com.example.licenta.filter.ObservationFilter;
import com.example.licenta.mapper.BirdMapper;
import com.example.licenta.query.BirdQueryBuilder;
import com.example.licenta.query.ObservationQueryBuilder;
import com.example.licenta.query.QueryDslAbstractBuilder;
import com.example.licenta.repository.BirdRepository;
import com.example.licenta.repository.ObservationRepository;
import com.example.licenta.service.BirdService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BirdsServiceImpl implements BirdService {

    private final ObservationRepository observationRepository;
    private final BirdMapper birdMapper;
    private final BirdRepository birdRepository;

    @Override
    public List<ObservationDto> getFilteredBirds(ObservationFilter observationFilter) {
        QueryDslAbstractBuilder queryDslAbstractBuilder = new ObservationQueryBuilder(observationFilter);
        Predicate booleanBuilder = queryDslAbstractBuilder.build();
        List<Observation> list = new ArrayList<>();
        observationRepository.findAll(booleanBuilder).forEach(list::add);

        return list.stream().map(birdMapper::toObservationDto).toList();
    }

    @Override
    public Page<BirdSpeciesDto> getTypes(Pageable page, String query) {

        BirdFilter birdFilter = new BirdFilter(query);
        QueryDslAbstractBuilder birdQueryBuilder = new BirdQueryBuilder(birdFilter);
        return birdRepository.findAll(birdQueryBuilder.build(), page).map(birdMapper::toBirdSpeciesDto);
    }

    @Override
    public List<ObservationDataDto> getObservationDataFiltered(ObservationFilter observationFilter) {
        QueryDslAbstractBuilder queryDslAbstractBuilder = new ObservationQueryBuilder(observationFilter);
        Predicate booleanBuilder = queryDslAbstractBuilder.build();

        if (observationFilter.getObservations() != null) {
            Pageable pageable = PageRequest.of(0, observationFilter.getObservations());
            Page<Observation> page = observationRepository.findAll(booleanBuilder, pageable);
            return page.getContent().stream().map(birdMapper::toObservationDataDto).toList();
        }

        List<Observation> list = new ArrayList<>();
        observationRepository.findAll(booleanBuilder).forEach(list::add);

        return list.stream().map(birdMapper::toObservationDataDto).toList();
    }
}
