package com.example.licenta.cloud;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.function.Predicate;

@Slf4j
@Service
@ConditionalOnMissingBean(value = CloudService.class, ignored = DefaultCloudStorage.class)
public class DefaultCloudStorage implements CloudService {

    private static final String ERROR_MESSAGE = "Cloud Storage Not Configured!";

    public DefaultCloudStorage() {
        log.error(ERROR_MESSAGE);
    }

    @Override
    public void uploadFile(MultipartFile file, String fileName) {
    }

    @Override
    public void uploadFile(File file, String fileName) {
    }

    @Override
    public String getFileUrl(String fileName) {
        return "abc";
    }

    @Override
    public boolean fileExists(String fileName) {
        return false;
    }

    @Override
    public void deleteUnusedFiles(Predicate<String> unusedFilePredicate) {
    }
}
