package com.teamg5.be.modules.retaurants.repository;
import com.teamg5.be.modules.retaurants.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>   {
    
}


