package com.teamg5.be.repository;

import com.teamg5.be.entity.FavouritePlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavouritePlaceRepository extends JpaRepository<FavouritePlace, Long> {
}
