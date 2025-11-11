package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.UserExam;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface IUserExamService {
    Optional<UserExam> getUserExamResult(Long userId, String examName);

    List<UserExam> getUserExamList(String examName, int limit);

    Double getScore(Long uexamId, Long time);

    Long addUserExam(Long userId, Long examId);

    Page<UserExam> searchResults(String province, Integer grade, String examName, int page, int size);
}
