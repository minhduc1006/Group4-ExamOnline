package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.models.SupportRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ISupportRequestRepository extends JpaRepository<SupportRequest, Long> {

    @Query("SELECT sr FROM SupportRequest sr " +
            "WHERE (:status IS NULL OR sr.status = :status) AND " +
            "(:issueCategory IS NULL OR sr.issueCategory = :issueCategory)")
    Page<SupportRequest> findFilteredSupportRequests(
            @Param("status") String status,
            @Param("issueCategory") String issueCategory,
            Pageable pageable
    );

    Page<SupportRequest> findByUserId(@Param("userId") Long userId, Pageable pageable);

    Optional<SupportRequest> findById(Long id);
}
