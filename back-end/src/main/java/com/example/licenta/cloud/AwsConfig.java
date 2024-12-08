package com.example.licenta.cloud;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "aws.config")
public class AwsConfig {

    private String region;
    private String secretKey;
    private String accessKeyId;
    private String imagesBucket;
    private String bucketEndpoint;
}

