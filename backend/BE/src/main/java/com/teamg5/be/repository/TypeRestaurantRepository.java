package com.teamg5.be.repository;
import com.teamg5.be.entity.TypeRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TypeRestaurantRepository extends JpaRepository<TypeRestaurant, Long>   {
    boolean existsByName(String name);
} 
