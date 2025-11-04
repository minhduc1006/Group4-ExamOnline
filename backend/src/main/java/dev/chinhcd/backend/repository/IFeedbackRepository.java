package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.models.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IFeedbackRepository extends JpaRepository<Feedback, Long> {

    @Query("SELECT f FROM Feedback f WHERE f.user.username LIKE %:username% AND f.rating = :rating")
    Page<Feedback> findByUserNameAndRating(@Param("username") String username, @Param("rating") Integer rating, PageRequest pageRequest);

    @Query("SELECT f FROM Feedback f WHERE f.user.username LIKE %:username%")
    Page<Feedback> findByUserName(@Param("username") String username, PageRequest pageRequest);

    @Query("SELECT f FROM Feedback f WHERE f.rating = :rating")
    Page<Feedback> findByRating(@Param("rating") Integer rating, PageRequest pageRequest);

    @Query("SELECT f FROM Feedback f")
    Page<Feedback> findAll(PageRequest pageRequest);
}
