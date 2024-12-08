package com.example.licenta.service;

import com.example.licenta.cloud.report.ObservationReportDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ObservationService {

    Page<ObservationReportDto> getObservations(int id, Pageable pageable);
}
