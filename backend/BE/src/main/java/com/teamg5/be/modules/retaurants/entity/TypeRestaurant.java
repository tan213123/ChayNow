package com.teamg5.be.modules.retaurants.entity;


import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Column;
import com.teamg5.be.shared.domain.BaseEntity;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name = "type_restaurant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TypeRestaurant extends BaseEntity {
    
    
    @Column(nullable = false, unique = true , length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "typeRestaurant")
    @Builder.Default
    private List<Restaurant> restaurants = new ArrayList<>();
}
