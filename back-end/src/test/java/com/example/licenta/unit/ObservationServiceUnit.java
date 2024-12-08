package com.example.licenta.unit;

import com.example.licenta.cloud.report.ObservationReportDto;
import com.example.licenta.repository.ObservationRepository;
import com.example.licenta.service.impl.ObservationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ObservationServiceUnit {

    @InjectMocks
    private ObservationServiceImpl observationService;

    @Mock
    private ObservationRepository observationRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getObservations_ShouldReturnObservationReportDtoPage() {
        int userId = 1;
        Pageable pageable = PageRequest.of(0, 10);

        ObservationReportDto reportDto = new ObservationReportDto();
        Page<ObservationReportDto> reportDtoPage = new PageImpl<>(List.of(reportDto));
        when(observationRepository.getReportsDto(userId, pageable)).thenReturn(reportDtoPage);

        Page<ObservationReportDto> result = observationService.getObservations(userId, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(reportDto, result.getContent().get(0));
        verify(observationRepository).getReportsDto(userId, pageable);
    }
}
