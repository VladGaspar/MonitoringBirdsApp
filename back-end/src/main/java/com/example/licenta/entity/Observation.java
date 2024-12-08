package com.example.licenta.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "observations")
public class Observation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "bird_id", nullable = false)
    private Bird birdId;
    private int noOfSpecimens;
    @Column(precision = 30, scale = 15)
    private BigDecimal latitude;
    @Column(precision = 30, scale = 15)
    private BigDecimal longitude;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User userid;

    @Override
    public String toString() {
        return "Observation{id=" + id + "}";
    }
}
