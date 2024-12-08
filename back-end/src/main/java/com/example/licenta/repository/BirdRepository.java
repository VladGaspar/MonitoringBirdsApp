package com.example.licenta.repository;

import com.example.licenta.dto.BirdObservationDto;
import com.example.licenta.entity.Bird;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BirdRepository extends JpaRepository<Bird, Integer>, QuerydslPredicateExecutor<Bird> {

    @Query(value = "SELECT o.birdId FROM Observation o WHERE o.userid.username = :username")
    List<Bird> findAllBirdsByUserId(@Param("username") String username);

    @Query("SELECT new com.example.licenta.dto.BirdObservationDto(o.birdId.id, o.noOfSpecimens) " +
            "FROM Observation o WHERE o.userid.username = :username")
    List<BirdObservationDto> findAllBirdsIdByUserId(@Param("username") String username);

    @Query("SELECT b.species FROM Bird b")
    Page<String> getAllSpecies(Pageable page);

}
