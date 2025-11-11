package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.SmallPractice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISmallPracticeRepository extends JpaRepository<SmallPractice, Long> {
    List<SmallPractice> findByPractice_PracticeLevelAndPractice_Grade(Integer practiceLevel, Integer grade);


    List<SmallPractice> findByPractice(Practice practice);

    Optional<SmallPractice> findByPracticeAndTestName(Practice practice, String testName);
}
