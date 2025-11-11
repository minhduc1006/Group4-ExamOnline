package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.SmallPractice;
import dev.chinhcd.backend.models.duclm.SmallPracticeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISmallPracticeQuestionRepository extends JpaRepository<SmallPracticeQuestion, Integer> {
    List<SmallPracticeQuestion> findBySmallPractice(SmallPractice smallPractice);

    List<SmallPracticeQuestion> findBySmallPractice_SmallPracticeId(int smallPracticeId);
}
