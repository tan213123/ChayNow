package com.teamg5.be.repository;

import com.teamg5.be.entity.RestaurantOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantOptionRepository extends JpaRepository<RestaurantOption, Long> {
    List<RestaurantOption> findByRestaurantId(Long restaurantId);
}
