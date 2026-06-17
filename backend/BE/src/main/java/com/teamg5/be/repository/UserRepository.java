package com.teamg5.be.repository;

import com.teamg5.be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.teamg5.be.entity.AccountStatus;
import com.teamg5.be.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u, (SELECT COUNT(r) FROM Review r WHERE r.user = u) " +
           "FROM User u " +
           "WHERE (:keyword IS NULL OR :keyword = '' OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:role IS NULL OR u.role = :role) " +
           "AND (:status IS NULL OR u.status = :status)")
    Page<Object[]> findAllAdminUsers(
            @Param("keyword") String keyword,
            @Param("role") Role role,
            @Param("status") AccountStatus status,
            Pageable pageable
    );
}
