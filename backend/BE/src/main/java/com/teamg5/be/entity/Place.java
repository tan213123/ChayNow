package com.teamg5.be.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "places")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Place extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255)
    private String district;

    @Column(length = 255)
    private String city;

    @Column(length = 500)
    private String address;

    private Double latitude;

    private Double longitude;

    @Column(name = "map_url", length = 1000)
    private String mapUrl;

    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Restaurant> restaurants = new ArrayList<>();
}
