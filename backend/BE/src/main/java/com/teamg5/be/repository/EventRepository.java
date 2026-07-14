package com.teamg5.be.repository;

import com.teamg5.be.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByRestaurantId(Long restaurantId);

    List<Event> findByStatusNot(String status);

    List<Event> findAllByRestaurantId(Long restaurantId);

    List<Event> findAllByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
}
