package com.example.licenta.service.impl;

import com.example.licenta.cloud.report.ObservationReportDto;
import com.example.licenta.repository.ObservationRepository;
import com.example.licenta.service.ObservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ObservationServiceImpl implements ObservationService {

    private final ObservationRepository observationRepository;


    @Override
    public Page<ObservationReportDto> getObservations(int id, Pageable pageable) {
        return observationRepository.getReportsDto(id, pageable);
    }

}
