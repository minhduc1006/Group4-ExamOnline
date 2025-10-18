package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.SmallPractice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISmallPracticeRepository extends JpaRepository<SmallPractice, Long> {
    List<SmallPractice> findByPractice_PracticeId(Integer practiceId);

    List<SmallPractice> findByPractice(Practice practice);
}
