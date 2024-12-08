package com.example.licenta.cloud.report;

import com.example.licenta.dto.ExportableDto;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;

@Slf4j
public class ExcelFileGenerator<T extends ExportableDto> {

    private static final int PAGE_SIZE = 10;
    private static final int HEADERS_ROW_NUMBER = 0;
    private static final String FILE_SUFFIX = ".xlsx";

    private final String sheetName;
    private final List<String> headers;
    private final Function<Pageable, Page<T>> fetchPaginatedData;

    private int rowNr = HEADERS_ROW_NUMBER + 1;

    @Builder
    public ExcelFileGenerator(String sheetName, List<String> headers,
                              Function<Pageable, Page<T>> fetchPaginatedData) {
        this.sheetName = Objects.requireNonNull(sheetName);
        this.headers = Objects.requireNonNull(headers);
        this.fetchPaginatedData = Objects.requireNonNull(fetchPaginatedData);
    }

    private static String getFileName() {
        return "report-" + UUID.randomUUID();
    }

    public File generateFileFromDataPages() {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(sheetName);
            CellStyle bold = getBoldStyle(workbook);

            addHeaders(sheet, bold);
            addDataRows(sheet);

            File tempFile = File.createTempFile(getFileName(), FILE_SUFFIX);
            OutputStream stream = new FileOutputStream(tempFile);
            workbook.write(stream);
            stream.close();

            return tempFile;

        } catch (Exception e) {
            log.error("Could not create workbook");
            return null;
        }
    }

    private CellStyle getBoldStyle(XSSFWorkbook workbook) {
        Font font = workbook.createFont();
        font.setBold(true);

        CellStyle style = workbook.createCellStyle();
        style.setFont(font);

        return style;
    }

    private void addHeaders(Sheet sheet, CellStyle style) {
        RowBuilder rowBuilder = RowBuilder.createRow(sheet, HEADERS_ROW_NUMBER);
        headers.forEach(header -> rowBuilder.addCell(header, style));
    }

    private void addDataRows(Sheet sheet) {
        Pageable pageable = PageRequest.of(0, PAGE_SIZE);
        Page<T> page = fetchPaginatedData.apply(pageable);

        while (page.hasContent()) {
            addPageRows(sheet, page);

            pageable = pageable.next();
            page = fetchPaginatedData.apply(pageable);
        }
    }

    private void addPageRows(Sheet sheet, Page<T> page) {
        page.getContent()
                .forEach(item -> createRow(sheet, item));
    }

    private void createRow(Sheet sheet, T item) {
        RowBuilder rowBuilder = RowBuilder.createRow(sheet, rowNr++);
        item.getValuesForExport().forEach(rowBuilder::addCell);
    }
}
