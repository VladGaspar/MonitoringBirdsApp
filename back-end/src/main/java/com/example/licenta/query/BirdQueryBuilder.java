package com.example.licenta.query;

import com.example.licenta.entity.QBird;
import com.example.licenta.filter.BirdFilter;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.util.Strings;

@RequiredArgsConstructor
public class BirdQueryBuilder implements QueryDslAbstractBuilder {

    private static final QBird BIRD = QBird.bird;
    private final BirdFilter birdFilter;

    @Override
    public Predicate build() {
        BooleanBuilder builder = new BooleanBuilder();
        prepareBuilder(builder);
        return builder;
    }

    private void prepareBuilder(BooleanBuilder builder) {
        if (Strings.isNotEmpty(birdFilter.getQuery())) {
            builder.and(BIRD.species.containsIgnoreCase(birdFilter.getQuery()));
        }
    }
}
