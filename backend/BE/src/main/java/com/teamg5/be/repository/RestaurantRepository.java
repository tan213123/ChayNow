package com.teamg5.be.repository;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.RestaurantStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    @Query("""
        SELECT r FROM Restaurant r
        WHERE (:keyword IS NULL OR :keyword = ''
            OR LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(r.address) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:status IS NULL OR r.status = :status)
        AND (:placeId IS NULL OR r.place.id = :placeId)
        ORDER BY r.createdAt DESC
    """)
    Page<Restaurant> findAllForAdmin(
            @Param("keyword") String keyword,
            @Param("status") RestaurantStatus status,
            @Param("placeId") Long placeId,
            Pageable pageable
    );
}


