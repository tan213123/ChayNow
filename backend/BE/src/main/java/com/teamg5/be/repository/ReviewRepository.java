package com.teamg5.be.repository;
import com.teamg5.be.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ReviewRepository extends JpaRepository<Review, Long>   {
    boolean existsByUser_IdAndRestaurant_Id(Long userId, Long restaurantId);

    List<Review> findByRestaurant_Id(Long restaurantId);

    Optional<Review> findByIdAndUser_Id(
            Long reviewId,
            Long userId
    );
   
    
}
