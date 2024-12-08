package com.example.licenta.unit;

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
import com.example.licenta.repository.UserRepository;
import com.example.licenta.service.impl.BirdsServiceImpl;
import com.querydsl.core.types.Predicate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class BirdServiceUnit {

    @InjectMocks
    private BirdsServiceImpl birdsService;

    @Mock
    private ObservationRepository observationRepository;

    @Mock
    private BirdMapper birdMapper;

    @Mock
    private BirdRepository birdRepository;

    @MockBean
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getFilteredBirds_ShouldReturnObservationDtoList() {
        ObservationFilter observationFilter = new ObservationFilter();
        QueryDslAbstractBuilder queryDslAbstractBuilder = new ObservationQueryBuilder(observationFilter);
        Predicate booleanBuilder = queryDslAbstractBuilder.build();

        List<Observation> observations = List.of(new Observation());
        when(observationRepository.findAll(booleanBuilder)).thenReturn(observations);

        ObservationDto observationDto = new ObservationDto();
        when(birdMapper.toObservationDto(any(Observation.class))).thenReturn(observationDto);

        List<ObservationDto> result = birdsService.getFilteredBirds(observationFilter);

        assertEquals(1, result.size());
        assertEquals(observationDto, result.get(0));
        verify(observationRepository).findAll(booleanBuilder);
        verify(birdMapper).toObservationDto(any(Observation.class));
    }

    @Test
    void getTypes_ShouldReturnBirdSpeciesDtoPage() {
        Pageable pageable = PageRequest.of(0, 10);
        String query = "sparrow";

        BirdFilter birdFilter = new BirdFilter(query);
        QueryDslAbstractBuilder birdQueryBuilder = new BirdQueryBuilder(birdFilter);
        Predicate booleanBuilder = birdQueryBuilder.build();

        BirdSpeciesDto birdSpeciesDto = new BirdSpeciesDto();
        Page<BirdSpeciesDto> birdSpeciesDtoPage = new PageImpl<>(List.of(birdSpeciesDto));
        when(birdRepository.findAll(booleanBuilder, pageable)).thenReturn(new PageImpl<>(List.of()));

        Page<BirdSpeciesDto> result = birdsService.getTypes(pageable, query);

        assertEquals(0, result.getTotalElements());
    }

    @Test
    void getObservationDataFiltered_ShouldReturnObservationDataDtoList_WithPagination() {
        ObservationFilter observationFilter = new ObservationFilter();
        observationFilter.setObservations(1);

        QueryDslAbstractBuilder queryDslAbstractBuilder = new ObservationQueryBuilder(observationFilter);
        Predicate booleanBuilder = queryDslAbstractBuilder.build();

        Pageable pageable = PageRequest.of(0, 1);
        Observation observation = new Observation();
        Page<Observation> page = new PageImpl<>(List.of(observation));
        when(observationRepository.findAll(booleanBuilder, pageable)).thenReturn(page);

        ObservationDataDto observationDataDto = new ObservationDataDto();
        when(birdMapper.toObservationDataDto(any(Observation.class))).thenReturn(observationDataDto);

        List<ObservationDataDto> result = birdsService.getObservationDataFiltered(observationFilter);

        assertEquals(1, result.size());
        assertEquals(observationDataDto, result.get(0));
        verify(observationRepository).findAll(booleanBuilder, pageable);
        verify(birdMapper).toObservationDataDto(any(Observation.class));
    }

    @Test
    void getObservationDataFiltered_ShouldReturnObservationDataDtoList_WithoutPagination() {
        ObservationFilter observationFilter = new ObservationFilter();

        QueryDslAbstractBuilder queryDslAbstractBuilder = new ObservationQueryBuilder(observationFilter);
        Predicate booleanBuilder = queryDslAbstractBuilder.build();

        List<Observation> observations = List.of(new Observation());
        when(observationRepository.findAll(booleanBuilder)).thenReturn(observations);

        ObservationDataDto observationDataDto = new ObservationDataDto();
        when(birdMapper.toObservationDataDto(any(Observation.class))).thenReturn(observationDataDto);

        List<ObservationDataDto> result = birdsService.getObservationDataFiltered(observationFilter);

        assertEquals(1, result.size());
        assertEquals(observationDataDto, result.get(0));
        verify(observationRepository).findAll(booleanBuilder);
        verify(birdMapper).toObservationDataDto(any(Observation.class));
    }
}
