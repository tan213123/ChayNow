package com.teamg5.be.repository;

import com.teamg5.be.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    boolean existsByName(String name);

    @Query("""
        SELECT p FROM Place p
        WHERE (:active IS NULL OR p.active = :active)
        AND (:keyword IS NULL OR :keyword = ''
            OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.district) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.city) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.address) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY p.name ASC
    """)
    Page<Place> findAllForAdmin(
            @Param("keyword") String keyword,
            @Param("active") Boolean active,
            Pageable pageable
    );
}
