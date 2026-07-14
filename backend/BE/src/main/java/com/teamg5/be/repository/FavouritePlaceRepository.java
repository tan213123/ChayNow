package com.teamg5.be.repository;

import com.teamg5.be.entity.FavouritePlace;
import com.teamg5.be.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavouritePlaceRepository extends JpaRepository<FavouritePlace, Long> {
    boolean existsByUserAndRestaurantId(User user, Long restaurantId);
    Optional<FavouritePlace> findByUserAndRestaurantId(User user, Long restaurantId);

    @Query(value = "SELECT fp FROM FavouritePlace fp " +
                   "JOIN FETCH fp.restaurant r " +
                   "JOIN FETCH r.typeRestaurant " +
                   "LEFT JOIN FETCH r.place " +
                   "LEFT JOIN FETCH r.owner " +
                   "WHERE fp.user = :user",
           countQuery = "SELECT count(fp) FROM FavouritePlace fp WHERE fp.user = :user")
    Page<FavouritePlace> findByUser(@Param("user") User user, Pageable pageable);
}

