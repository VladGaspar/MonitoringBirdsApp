package com.example.licenta.cloud;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.paginators.ListObjectsV2Iterable;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import static com.example.licenta.cloud.FilePrefix.IMAGE;

@Slf4j
@Service
@Profile("aws")
public class S3Service implements CloudService {

    private final AwsConfig awsConfig;
    private final S3Client s3Client;

    @Autowired
    public S3Service(AwsConfig awsConfig) {
        this.awsConfig = awsConfig;
        this.s3Client = initClient();
        log.info("Selected AWS cloud storage.");
    }

    public S3Service(AwsConfig awsConfig, S3Client s3Client) {
        this.awsConfig = awsConfig;
        this.s3Client = s3Client;
        log.info("Selected AWS cloud storage with mock client for testing.");
    }

    private S3Client initClient() {
        final AwsBasicCredentials credentials = AwsBasicCredentials
                .create(awsConfig.getAccessKeyId(), awsConfig.getSecretKey());

        final StaticCredentialsProvider credentialsProvider = StaticCredentialsProvider
                .create(credentials);

        final S3Configuration s3Config = S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build();

        return S3Client.builder()
                .region(Region.of(awsConfig.getRegion()))
                .credentialsProvider(credentialsProvider)
                .serviceConfiguration(s3Config)
                .endpointOverride(URI.create(awsConfig.getBucketEndpoint()))
                .build();
    }

    @Override
    public void uploadFile(MultipartFile file, String fileName) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(awsConfig.getImagesBucket())
                .key(fileName)
                .build();

        try (final InputStream stream = file.getInputStream()) {
            RequestBody requestBody = RequestBody.fromInputStream(stream, file.getSize());
            s3Client.putObject(request, requestBody);

        } catch (IOException e) {
            log.error("Error when uploading file {} to S3 ({})", file.getOriginalFilename(),
                    e.getMessage());
        }
    }

    @Override
    public void uploadFile(File file, String fileName) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(awsConfig.getImagesBucket())
                .key(fileName)
                .build();

        try {
            RequestBody requestBody = RequestBody.fromFile(file);
            s3Client.putObject(request, requestBody);

        } catch (Exception e) {
            log.error("Error when uploading file {} to S3 ({})", fileName, e.getMessage());
        }
    }

    @Override
    public String getFileUrl(String key) {
        GetUrlRequest request = GetUrlRequest.builder()
                .bucket(awsConfig.getImagesBucket())
                .key(key)
                .build();

        return s3Client.utilities().getUrl(request).toString();
    }

    @Override
    public boolean fileExists(String key) {
        HeadObjectRequest request = HeadObjectRequest.builder()
                .bucket(awsConfig.getImagesBucket())
                .key(key)
                .build();

        try {
            s3Client.headObject(request);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        }
    }

    @Override
    public void deleteUnusedFiles(Predicate<String> unusedFilePredicate) {
        ListObjectsV2Request request = ListObjectsV2Request.builder()
                .bucket(awsConfig.getImagesBucket())
                .prefix(IMAGE.getPrefix())
                .maxKeys(MAX_KEYS)
                .build();

        ListObjectsV2Iterable result = s3Client.listObjectsV2Paginator(request);

        result.iterator().forEachRemaining(page -> deletePageFiles(page, unusedFilePredicate));
    }

    private void deleteFileBatch(List<String> fileKeys) {
        List<ObjectIdentifier> objectsToDelete = fileKeys.stream()
                .map(link -> ObjectIdentifier.builder().key(link).build())
                .toList();

        Delete delete = Delete.builder()
                .objects(objectsToDelete)
                .build();

        DeleteObjectsRequest request = DeleteObjectsRequest.builder()
                .bucket(awsConfig.getImagesBucket())
                .delete(delete)
                .build();

        s3Client.deleteObjects(request);
    }

    private void deletePageFiles(ListObjectsV2Response page,
                                 Predicate<String> unusedFilePredicate) {
        List<String> pageKeys = page.contents()
                .stream()
                .map(S3Object::key)
                .filter(unusedFilePredicate)
                .collect(Collectors.toList());

        if (!pageKeys.isEmpty()) {
            deleteFileBatch(pageKeys);
        }
    }
}

