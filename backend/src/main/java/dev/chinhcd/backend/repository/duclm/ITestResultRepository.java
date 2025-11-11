package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.TestResult;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ITestResultRepository extends JpaRepository<TestResult, Long> {

    Optional<TestResult> findByUserIdAndSmallPractice_SmallPracticeId(Long userId, Integer smallPracticeId);

    TestResult findTestResultBySmallPractice_SmallPracticeIdAndUserId(int smallPractice_smallPracticeId, Long user_id);

    @Modifying
    @Transactional
    @Query("DELETE FROM TestResult t WHERE t.smallPractice.smallPracticeId = :levelId AND t.user.id = :userId")
    Integer deleteBySmallPractice_SmallPracticeIdAndUser(@Param("levelId") Integer levelId, @Param("userId") Long userId);

}
