package com.teamg5.be.repository;

import com.teamg5.be.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
   Optional<Place> findByIdAndActiveTrue(Long placeId);

    List<Place> findAllByActiveTrue();

    List<Place> findAllByActiveFalse();
   
}
