package com.example.licenta.mapper;

import com.example.licenta.dto.BirdDto;
import com.example.licenta.dto.ComparisonDto;
import com.example.licenta.dto.UserResponseDto;
import com.example.licenta.dto.auth.RegisterDto;
import com.example.licenta.dto.auth.RegisterResponseDto;
import com.example.licenta.entity.Bird;
import com.example.licenta.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(componentModel = "spring", unmappedTargetPolicy = IGNORE)
public interface UserMapper {
    @Named("toBirdDto")
    static List<BirdDto> toBirdDto(List<Bird> birds) {
        return birds.stream()
                .map(bird -> BirdDto.builder()
                        .rarity(bird.getRarity())
                        .species(bird.getSpecies())
                        .build())
                .collect(Collectors.toList());
    }

    UserResponseDto userToUserResponseDto(User user);

    User registerDtoToUser(RegisterDto registerDto);

    RegisterResponseDto userToRegisterResponseDto(User user);

    @Mapping(source = "birds", target = "birds", qualifiedByName = "toBirdDto")
    ComparisonDto userToComparisonDto(String username, int commonNo, int uncommonNo, int rareNo, List<Bird> birds, long totalScore);
}
