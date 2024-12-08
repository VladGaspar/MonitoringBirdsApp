package com.example.licenta.cloud.report;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class RowBuilder {

    private final Row row;
    private int column;

    private RowBuilder(Sheet sheet, int rowNr) {
        this.row = sheet.createRow(rowNr);
        this.column = 0;
    }

    public static RowBuilder createRow(Sheet sheet, int rowNr) {
        return new RowBuilder(sheet, rowNr);
    }

    public <T> RowBuilder addCell(T value) {
        this.row.createCell(column++)
                .setCellValue(String.valueOf(value));

        return this;
    }

    public <T> RowBuilder addCell(T value, CellStyle style) {
        Cell cell = this.row.createCell(column++);
        cell.setCellValue(String.valueOf(value));
        cell.setCellStyle(style);

        return this;
    }
}

