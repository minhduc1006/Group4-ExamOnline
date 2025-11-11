package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.Exam;
import dev.chinhcd.backend.models.duclm.UserExam;
import dev.chinhcd.backend.repository.duclm.IExamRepository;
import dev.chinhcd.backend.repository.duclm.IUserExamRepository;
import dev.chinhcd.backend.services.IUserService;
import dev.chinhcd.backend.services.duclm.IUserExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserExamService implements IUserExamService {

    private final IUserExamRepository userExamRepository;
    private final IExamRepository examRepository;
    private final IUserService userService;

    @Override
    public Page<UserExam> searchResults(String province, Integer grade, String examName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserExam> userExamPage = userExamRepository.searchResults(examName, grade, province, pageable);

        // Xử lý ánh xạ dữ liệu trước khi trả về
        return userExamPage.map(userExam -> {
            User user = new User();
            user.setId(userExam.getUser().getId());
            user.setName(userExam.getUser().getName());
            user.setGrade(userExam.getUser().getGrade());
            user.setProvince(userExam.getUser().getProvince());
            userExam.setUser(user);
            return userExam;
        });
    }

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

    @Override
    public Double getScore(Long uexamId, Long time) {
        LocalTime localTime = LocalTime.ofSecondOfDay(time);
        Time timeSpent = Time.valueOf(localTime);
        UserExam ue = userExamRepository.findByUserExamId(uexamId).get();
        ue.setTotalTime(timeSpent);
        userExamRepository.save(ue);
        return ue.getScore();
    }

    @Override
    public Long addUserExam(Long userId, Long examId) {
        Exam e = examRepository.findById(examId).orElse(null);
        User u = userService.getUserById(userId);
        UserExam ue = new UserExam();
        ue.setTotalTime(Time.valueOf("00:45:00"));
        ue.setExamName(e.getExamName());
        ue.setUser(u);
        ue.setScore(0.0d);
        ue.setExam(e);
        ue.setUser(userService.getUserById(userId));
        UserExam us = userExamRepository.save(ue);
        return us.getUserExamId();
    }

}
