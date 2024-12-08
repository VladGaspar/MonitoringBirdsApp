package com.example.licenta.cloud;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;

public interface FileService {

    String uploadFile(MultipartFile file);

    String uploadFile(File file);

    void deleteUnusedFiles();

}

