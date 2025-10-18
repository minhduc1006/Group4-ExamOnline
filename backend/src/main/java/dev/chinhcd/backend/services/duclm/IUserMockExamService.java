package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.UserMockExam;

import java.util.List;


public interface IUserMockExamService {
    UserMockExam getMostRecentMockExam(Long userId);

    List<UserMockExam> getAggregatedResults(Long userId);
}

