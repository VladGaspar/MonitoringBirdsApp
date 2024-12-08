package com.example.licenta.entity;

import com.example.licenta.enums.Rarity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "birds")
public class Bird {
    String species;
    @Enumerated(EnumType.STRING)
    Rarity rarity;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "birdId")
    private List<Observation> observations;

    @Override
    public String toString() {
        return "Bird{id=" + id + ", species='" + species + "', rarity='" + rarity + "'}";
    }
}
