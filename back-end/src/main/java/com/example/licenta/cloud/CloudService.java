package com.example.licenta.cloud;


import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.function.Predicate;

public interface CloudService {

    int MAX_KEYS = 100;

    void uploadFile(MultipartFile file, String fileName);

    void uploadFile(File file, String fileName);

    String getFileUrl(String fileName);

    boolean fileExists(String fileName);

    void deleteUnusedFiles(Predicate<String> unusedFilePredicate);
}
