package com.teamg5.be.repository;

import com.teamg5.be.entity.ReviewTestOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewTestOptionRepository extends JpaRepository<ReviewTestOption, Long> {
    List<ReviewTestOption> findByActiveTrueOrderByDisplayOrderAscIdAsc();
    boolean existsByLabelIgnoreCase(String label);
}
