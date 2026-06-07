package com.teamg5.be.repository;
import com.teamg5.be.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>   {
    
}


