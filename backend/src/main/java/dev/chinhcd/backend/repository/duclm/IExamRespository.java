package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface IExamRespository extends JpaRepository<Exam, Long>  {

    @Query("SELECT MAX(e.level) FROM Exam e")
    Optional<Integer> findMaxLevel();
}
