package com.teamg5.be.modules.retaurants.repository;
import com.teamg5.be.modules.retaurants.entity.TypeRestaurant;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TypeRestaurantRepository extends JpaRepository<TypeRestaurant, Long>   {
    boolean existsByName(String name);
} 
