package com.teamg5.be.repository;

import com.teamg5.be.entity.Posting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostingRepository extends JpaRepository<Posting, Long> {

    /**
     * Lấy danh sách bài đăng của owner (theo các nhà hàng owner đó sở hữu).
     * Hỗ trợ lọc theo status (PENDING/APPROVED/REJECTED) và tìm kiếm theo title/content.
     */
    @Query("""
        SELECT p FROM Posting p
        WHERE p.restaurant.owner.id = :ownerId
        AND (:status IS NULL OR :status = '' OR p.status = :status)
        AND (:keyword IS NULL OR :keyword = ''
            OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY p.createdAt DESC
    """)
    Page<Posting> findByOwner(
            @Param("ownerId") Long ownerId,
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    /**
     * Lấy danh sách bài đăng theo nhà hàng cụ thể của owner.
     */
    @Query("""
        SELECT p FROM Posting p
        WHERE p.restaurant.id = :restaurantId
        AND p.restaurant.owner.id = :ownerId
        AND (:status IS NULL OR :status = '' OR p.status = :status)
        AND (:keyword IS NULL OR :keyword = ''
            OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY p.createdAt DESC
    """)
    Page<Posting> findByOwnerAndRestaurant(
            @Param("ownerId") Long ownerId,
            @Param("restaurantId") Long restaurantId,
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    /**
     * Lấy danh sách bài đăng cho Admin (Hỗ trợ lọc theo status và tìm kiếm từ khóa trong tiêu đề, nội dung, hoặc tên nhà hàng).
     */
    @Query("""
        SELECT p FROM Posting p
        WHERE (:status IS NULL OR :status = '' OR p.status = :status)
        AND (:keyword IS NULL OR :keyword = ''
            OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.restaurant.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY p.createdAt DESC
    """)
    Page<Posting> findAllForAdmin(
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByStatus(String status);

    long countByLikeCountGreaterThanEqual(Integer likeCount);

    @Query("SELECT COUNT(DISTINCT p.category) FROM Posting p WHERE p.category IS NOT NULL AND p.category <> ''")
    long countDistinctCategories();

    @Query("SELECT p.category, COUNT(p) FROM Posting p WHERE p.category IS NOT NULL AND p.category <> '' GROUP BY p.category")
    List<Object[]> findFoodCategoriesWithPostCount();

    @Query("""
        SELECT p FROM Posting p
        WHERE (:status IS NULL OR :status = '' OR p.status = :status)
        AND (:categoryId IS NULL OR :categoryId = '' OR p.category = :categoryId)
        AND (:minLikes IS NULL OR p.likeCount >= :minLikes)
        AND (:keyword IS NULL OR :keyword = ''
            OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.restaurant.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<Posting> findAllFoodPosts(
            @Param("status") String status,
            @Param("categoryId") String categoryId,
            @Param("minLikes") Integer minLikes,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("""
        SELECT p FROM Posting p
        WHERE p.status = 'APPROVED'
        AND (:categoryId IS NULL OR :categoryId = '' OR p.category = :categoryId)
        AND (:restaurantId IS NULL OR p.restaurant.id = :restaurantId)
        AND (:placeId IS NULL OR (p.restaurant.place IS NOT NULL AND p.restaurant.place.id = :placeId))
        AND (:keyword IS NULL OR :keyword = ''
            OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(p.restaurant.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY p.createdAt DESC
    """)
    Page<Posting> findApprovedPublicPostings(
            @Param("categoryId") String categoryId,
            @Param("restaurantId") Long restaurantId,
            @Param("placeId") Long placeId,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("""
        SELECT p FROM Posting p
        WHERE p.id = :id
        AND p.status = 'APPROVED'
    """)
    java.util.Optional<Posting> findApprovedById(@Param("id") Long id);
}
