package com.teamg5.be.repository;

import com.teamg5.be.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPosting_IdOrderByCreatedAtAsc(Long postingId, Pageable pageable);

    Optional<Comment> findByIdAndUser_Id(Long commentId, Long userId);

    long countByPosting_Id(Long postingId);
}
