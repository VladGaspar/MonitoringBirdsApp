package com.example.licenta.cloud;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum FilePrefix {
    IMAGE("image-"), REPORT("report-");

    private final String prefix;
}

