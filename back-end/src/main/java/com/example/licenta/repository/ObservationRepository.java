package com.example.licenta.repository;

import com.example.licenta.cloud.report.ObservationReportDto;
import com.example.licenta.entity.Observation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ObservationRepository extends JpaRepository<Observation, Integer>, QuerydslPredicateExecutor<Observation> {

    @Query("""
            SELECT new com.example.licenta.cloud.report.ObservationReportDto(b.species,b.rarity,o.noOfSpecimens,o.date,o.latitude,o.longitude)
            FROM Observation o
            JOIN o.birdId b
            WHERE o.userid.id = :userId
            """)
    Page<ObservationReportDto> getReportsDto(@Param("userId") int id, Pageable pageable);


}
