package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.UserExam;
import dev.chinhcd.backend.repository.duclm.IUserExamRepository;
import dev.chinhcd.backend.services.duclm.IUserExamService;

import java.awt.print.Pageable;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserExamService implements IUserExamService {

    private final IUserExamRepository userExamRepository;

    @Override
    public Optional<UserExam> getUserExamResult(Long userId, String examName) {
        Optional<UserExam> userExamOpt = userExamRepository.findTopByUserIdAndExamNameOrderByUserExamIdDesc(userId, examName);

        if (userExamOpt.isPresent()) {
            UserExam userExam = userExamOpt.get();
            User user = new User();
            user.setId(userId);
            userExam.setUser(new User());
            return Optional.of(userExam);
        }

        return Optional.empty();
    }

    @Override
    public List<UserExam> getUserExamList(String examName, int limit) {
        List<UserExam> userExamList = userExamRepository.findTopUsersByExamName(examName, limit);

        if (userExamList.isEmpty()) {
            return Collections.emptyList();
        }

        for (UserExam userExam : userExamList) {
            if (userExam.getUser() != null) {
                User user = new User();
                user.setId(userExam.getUser().getId()); // Chỉ giữ lại userId
                userExam.setUser(user);
            }
        }
        return userExamList;
    }

}
