package com.example.licenta.repository;

import com.example.licenta.dto.LeaderBoardUserDto;
import com.example.licenta.dto.UserInfoDto;
import com.example.licenta.entity.Bird;
import com.example.licenta.entity.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    default User getByUsername(String username) {
        return findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException("Cannot find user by username: " + username));
    }

    Optional<User> findByUsername(String username);

    @Query("SELECT new com.example.licenta.dto.LeaderBoardUserDto(u.username, SUM(CASE b.rarity " +
            "WHEN com.example.licenta.enums.Rarity.NO_RARITY THEN 0 " +
            "WHEN com.example.licenta.enums.Rarity.COMMON THEN (1 * o.noOfSpecimens) " +
            "WHEN com.example.licenta.enums.Rarity.UNCOMMON THEN (4 * o.noOfSpecimens) " +
            "WHEN com.example.licenta.enums.Rarity.RARE THEN (11 * o.noOfSpecimens) " +
            "ELSE 0 END)) " +
            "FROM User u " +
            "JOIN u.observations o " +
            "JOIN o.birdId b " +
            "WHERE b.id IN (SELECT DISTINCT ob.birdId.id FROM Observation ob WHERE ob.userid.id = u.id) " +
            "GROUP BY u.id, u.username " +
            "ORDER BY SUM(CASE b.rarity " +
            "WHEN com.example.licenta.enums.Rarity.NO_RARITY THEN 0 " +
            "WHEN com.example.licenta.enums.Rarity.COMMON THEN (1 * o.noOfSpecimens) " +
            "WHEN com.example.licenta.enums.Rarity.UNCOMMON THEN (4 * o.noOfSpecimens) " +
            "WHEN com.example.licenta.enums.Rarity.RARE THEN (11 * o.noOfSpecimens) " +
            "ELSE 0 END) DESC limit 15")
    List<LeaderBoardUserDto> findTopUsersByPoints();

    @Query("SELECT b " +
            "FROM User u JOIN u.observations o JOIN o.birdId b" +
            " WHERE u.username = :username")
    List<Bird> findDistinctBirdsByUserId(String username);


    @Query("SELECT SUM(CASE b.rarity " +
            "WHEN com.example.licenta.enums.Rarity.NO_RARITY THEN 0 " +
            "WHEN com.example.licenta.enums.Rarity.COMMON THEN (1 * o.noOfSpecimens) " +
            "WHEN com.example.licenta.enums.Rarity.UNCOMMON THEN (4 * o.noOfSpecimens) " +
            "WHEN com.example.licenta.enums.Rarity.RARE THEN (11 * o.noOfSpecimens) " +
            "ELSE 0 END) " +
            "FROM User u " +
            "JOIN u.observations o " +
            "JOIN o.birdId b " +
            "WHERE u.username = :username " +
            "GROUP BY u.id")
    Long findScoreByUsername(@Param("username") String username);

    @Query("""
            SELECT new com.example.licenta.dto.UserInfoDto(u.username, u.firstName, u.lastName, COUNT (o.id), COUNT(distinct o.birdId.id))
            FROM User u
            JOIN u.observations o
            WHERE u.id = :userId
            """)
    UserInfoDto getUserInfoDto(@Param("userId") int id);

}
