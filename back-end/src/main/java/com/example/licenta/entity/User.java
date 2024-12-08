package com.example.licenta.entity;

import com.example.licenta.enums.RoleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String username;
    private String firstName;
    private String lastName;
    private String password;
    @Enumerated(EnumType.STRING)
    private RoleType role;
    @OneToMany(mappedBy = "userid")
    private List<Observation> observations;

    @Override
    public String toString() {
        return "User{id=" + id + ", username='" + username + "'}";
    }
}
