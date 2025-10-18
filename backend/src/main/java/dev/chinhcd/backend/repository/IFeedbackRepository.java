package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.models.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IFeedbackRepository extends JpaRepository<Feedback, Long> {

}
