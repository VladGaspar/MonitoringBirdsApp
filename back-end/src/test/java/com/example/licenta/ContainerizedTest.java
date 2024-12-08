package com.example.licenta;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.MySQLContainer;

@ContextConfiguration(initializers = {ContainerizedTest.Initializer.class})
@ActiveProfiles("itest")
public abstract class ContainerizedTest {

    public static final ObjectMapper mapper = new ObjectMapper();
    private static final MySQLContainer<?> MYSQL_CONTAINER;

    static {
        MYSQL_CONTAINER = new MySQLContainer<>("mysql:latest")
                .withDatabaseName("testdb")
                .withUsername("testuser")
                .withPassword("testpass");
        MYSQL_CONTAINER.start();
    }

    public static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

        @Override
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            System.setProperty("DB_URL", MYSQL_CONTAINER.getJdbcUrl());
            System.setProperty("DB_USERNAME", MYSQL_CONTAINER.getUsername());
            System.setProperty("DB_PASSWORD", MYSQL_CONTAINER.getPassword());

            TestPropertyValues.of(
                    "spring.datasource.url=" + MYSQL_CONTAINER.getJdbcUrl(),
                    "spring.datasource.username=" + MYSQL_CONTAINER.getUsername(),
                    "spring.datasource.password=" + MYSQL_CONTAINER.getPassword(),
                    "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect",
                    "spring.jpa.hibernate.ddl-auto=update"
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
}
