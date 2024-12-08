package com.example.licenta.cloud.report;


import com.example.licenta.cloud.FileService;
import com.example.licenta.service.ObservationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final FileService fileService;
    private final ObservationService observationService;

    @Override
    public String getUsersReport(int loggedUserId) {

        ExcelFileGenerator<ObservationReportDto> excelFileGenerator = ExcelFileGenerator
                .<ObservationReportDto>builder()
                .sheetName("Observations")
                .headers(ObservationReportDto.getExportHeaders())
                .fetchPaginatedData(pageable -> observationService.getObservations(loggedUserId, pageable))
                .build();

        File file = excelFileGenerator.generateFileFromDataPages();

        String link = fileService.uploadFile(file);
        file.delete();

        return link;
    }

}
