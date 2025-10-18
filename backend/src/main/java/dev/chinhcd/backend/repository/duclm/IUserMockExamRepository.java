package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.UserMockExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IUserMockExamRepository extends JpaRepository<UserMockExam, Long> {
    UserMockExam findTopByUser_IdOrderByUserMockExamIdDesc(Long userId);

    List<UserMockExam> findByUser_Id(Long userId);
}
