package com.teamg5.be.repository;

import com.teamg5.be.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
   // List<Place> findActivePlace();
}
