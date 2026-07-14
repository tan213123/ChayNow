package com.teamg5.be.repository;

import com.teamg5.be.entity.Report;
import com.teamg5.be.entity.ReportStatus;
import com.teamg5.be.entity.ReportTargetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query(value = """
        SELECT r FROM Report r
        JOIN FETCH r.reporter rep
        WHERE (:status IS NULL OR r.status = :status)
          AND (:targetType IS NULL OR r.targetType = :targetType)
          AND (:keyword IS NULL OR :keyword = ''
               OR LOWER(r.reason) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(rep.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR (r.targetType = com.teamg5.be.entity.ReportTargetType.REVIEW AND EXISTS (
                   SELECT rev FROM Review rev WHERE rev.id = r.targetId AND LOWER(rev.context) LIKE LOWER(CONCAT('%', :keyword, '%'))
               ))
               OR (r.targetType = com.teamg5.be.entity.ReportTargetType.POST AND EXISTS (
                   SELECT p FROM Posting p WHERE p.id = r.targetId AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))
               ))
               OR (r.targetType = com.teamg5.be.entity.ReportTargetType.RESTAURANT AND EXISTS (
                   SELECT res FROM Restaurant res WHERE res.id = r.targetId AND (LOWER(res.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(res.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
               )))
    """, countQuery = """
        SELECT COUNT(r) FROM Report r
        WHERE (:status IS NULL OR r.status = :status)
          AND (:targetType IS NULL OR r.targetType = :targetType)
          AND (:keyword IS NULL OR :keyword = ''
               OR LOWER(r.reason) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(r.reporter.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR (r.targetType = com.teamg5.be.entity.ReportTargetType.REVIEW AND EXISTS (
                   SELECT rev FROM Review rev WHERE rev.id = r.targetId AND LOWER(rev.context) LIKE LOWER(CONCAT('%', :keyword, '%'))
               ))
               OR (r.targetType = com.teamg5.be.entity.ReportTargetType.POST AND EXISTS (
                   SELECT p FROM Posting p WHERE p.id = r.targetId AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))
               ))
               OR (r.targetType = com.teamg5.be.entity.ReportTargetType.RESTAURANT AND EXISTS (
                   SELECT res FROM Restaurant res WHERE res.id = r.targetId AND (LOWER(res.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(res.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
               )))
    """)
    Page<Report> findAllFiltered(
            @Param("status") ReportStatus status,
            @Param("targetType") ReportTargetType targetType,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query("SELECT r FROM Report r JOIN FETCH r.reporter WHERE r.id = :id")
    Optional<Report> findByIdWithReporter(@Param("id") Long id);

    long countByStatus(ReportStatus status);
}
