package com.teamg5.be.repository;
import com.teamg5.be.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>   {
  Optional<Restaurant> findByIdAndActiveTrue(Long id);

    List<Restaurant> findAllByActiveTrue();

    List<Restaurant> findAllByActiveFalse();
    boolean existsByPlace_IdAndActiveTrue(Long placeId);
}


