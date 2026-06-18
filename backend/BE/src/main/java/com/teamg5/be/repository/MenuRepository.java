package com.teamg5.be.repository;

import com.teamg5.be.entity.Menu;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByIdAndActiveTrue(Long menuId);

    List<Menu> findAllByActiveTrue();

    List<Menu> findAllByActiveFalse();

    List<Menu> findByRestaurant_IdAndActiveTrue(Long restaurantId);
}
