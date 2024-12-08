package com.example.licenta.cloud;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

import static com.example.licenta.cloud.FilePrefix.IMAGE;
import static com.example.licenta.cloud.FilePrefix.REPORT;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final CloudService cloudService;

    @Override
    public String uploadFile(MultipartFile file) {
        String fileName = getImageName();

        while (cloudService.fileExists(fileName)) {
            fileName = getImageName();
        }

        cloudService.uploadFile(file, fileName);
        return cloudService.getFileUrl(fileName);
    }

    @Override
    public String uploadFile(File file) {
        String fileName = getReportName();

        while (cloudService.fileExists(fileName)) {
            fileName = getReportName();
        }

        cloudService.uploadFile(file, fileName);
        return cloudService.getFileUrl(fileName);
    }

    @Override
    public void deleteUnusedFiles() {
        cloudService.deleteUnusedFiles(this::checkUnusedImageUrl);
    }

    private boolean checkUnusedImageUrl(String url) {
        return false;
    }

    private String getReportName() {
        return REPORT.getPrefix() + UUID.randomUUID() + ".xlsx";
    }

    private String getImageName() {
        return IMAGE.getPrefix() + UUID.randomUUID();
    }
}
