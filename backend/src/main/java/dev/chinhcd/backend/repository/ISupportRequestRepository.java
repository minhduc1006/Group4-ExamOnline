package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.models.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISupportRequestRepository extends JpaRepository<SupportRequest, Long> {
}
