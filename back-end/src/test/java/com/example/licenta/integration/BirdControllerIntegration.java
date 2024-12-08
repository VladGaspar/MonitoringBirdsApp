package com.example.licenta.integration;

import com.example.licenta.controller.BirdController;
import com.example.licenta.dto.BirdSpeciesDto;
import com.example.licenta.dto.ObservationDataDto;
import com.example.licenta.dto.ObservationDto;
import com.example.licenta.dto.UserResponseDto;
import com.example.licenta.entity.User;
import com.example.licenta.enums.RoleType;
import com.example.licenta.filter.ObservationFilter;
import com.example.licenta.security.JwtTokenProvider;
import com.example.licenta.service.BirdService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BirdController.class)
class BirdControllerIntegration {


    private MockMvc mockMvc;
    private User user;
    private String token;

    @MockBean
    private BirdService birdService;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
        MockitoAnnotations.openMocks(this);

        token = jwtTokenProvider.createAuthToken(
                UserResponseDto.builder().username("testuser").role(RoleType.USER).build());
    }

    @Test
    void getFilteredBirds_ShouldReturnObservationDtoList() throws Exception {
        ObservationDto observationDto = new ObservationDto();
        List<ObservationDto> observationDtos = List.of(observationDto);

        when(birdService.getFilteredBirds(any(ObservationFilter.class))).thenReturn(observationDtos);

        mockMvc.perform(get("/birds")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().json("[{}]"));
    }

    @Test
    void getObservationData_ShouldReturnObservationDataDtoList() throws Exception {
        ObservationDataDto observationDataDto = new ObservationDataDto();
        List<ObservationDataDto> observationDataDtos = List.of(observationDataDto);

        when(birdService.getObservationDataFiltered(any(ObservationFilter.class))).thenReturn(observationDataDtos);

        mockMvc.perform(get("/birds/observations")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("[{}]"));
    }

    @Test
    void getTypes_ShouldReturnBirdSpeciesDtoPage() throws Exception {
        BirdSpeciesDto birdSpeciesDto = new BirdSpeciesDto();
        Page<BirdSpeciesDto> birdSpeciesDtoPage = new PageImpl<>(List.of(birdSpeciesDto), PageRequest.of(0, 40), 1);

        when(birdService.getTypes(any(Pageable.class), any(String.class))).thenReturn(birdSpeciesDtoPage);

        mockMvc.perform(get("/birds/types")
                        .param("query", "test")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"content\":[{}],\"pageable\":{\"pageNumber\":0,\"pageSize\":40},\"totalElements\":1}"));
    }
}
