package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ITestResultRepository extends JpaRepository<TestResult, Long> {

    Optional<TestResult> findByUserIdAndSmallPractice_SmallPracticeId(Long userId, Integer smallPracticeId);
}
