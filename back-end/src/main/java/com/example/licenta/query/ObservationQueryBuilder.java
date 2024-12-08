package com.example.licenta.query;

import com.example.licenta.entity.QBird;
import com.example.licenta.entity.QObservation;
import com.example.licenta.filter.ObservationFilter;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;

import java.util.Optional;


@RequiredArgsConstructor
public class ObservationQueryBuilder implements QueryDslAbstractBuilder {

    private static final QObservation OBSERVATION = QObservation.observation;
    private static final QBird BIRD = QBird.bird;
    private final ObservationFilter observationFilter;

    @Override
    public Predicate build() {
        BooleanBuilder builder = new BooleanBuilder();

        if (Strings.isNotEmpty(observationFilter.getSpecies())) {
            builder.and(OBSERVATION.birdId.species.containsIgnoreCase(observationFilter.getSpecies()));
        }

        Optional.ofNullable(observationFilter.getStartDate())
                .map(OBSERVATION.date::goe)
                .ifPresent(builder::and);

        Optional.ofNullable(observationFilter.getEndDate())
                .map(OBSERVATION.date::loe)
                .ifPresent(builder::and);

        if (observationFilter.getComparisonYear() == null) {
            Optional.ofNullable(observationFilter.getYear())
                    .map(OBSERVATION.date.year()::eq)
                    .ifPresent(builder::and);
        }

        if (observationFilter.getYear() != null && observationFilter.getComparisonYear() != null) {
            builder.and(OBSERVATION.date.year().eq(observationFilter.getYear())
                    .or(OBSERVATION.date.year().eq(observationFilter.getComparisonYear())));
        }

        return builder;
    }
}
