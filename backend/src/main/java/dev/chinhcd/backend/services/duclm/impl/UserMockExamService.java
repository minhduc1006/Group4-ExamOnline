package dev.chinhcd.backend.services.duclm.impl;


import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.models.duclm.MockExam;
import dev.chinhcd.backend.models.duclm.UserMockExam;
import dev.chinhcd.backend.repository.duclm.IMockExamRepository;
import dev.chinhcd.backend.repository.duclm.IUserMockExamRepository;
import dev.chinhcd.backend.services.IUserService;
import dev.chinhcd.backend.services.duclm.IUserMockExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserMockExamService implements IUserMockExamService {

    private final IUserMockExamRepository userMockExamRepository;
    private final IMockExamRepository mockExamRepository;
    private final IUserService userService;

    @Override
    public UserMockExam getMostRecentMockExam(Long userId) {
        UserMockExam userMockExam = new UserMockExam();
        UserMockExam userMockExam1 = userMockExamRepository.findTopByUser_IdOrderByUserMockExamIdDesc(userId);
        if (userMockExam1 != null) {
            userMockExam.setExamName(userMockExam1.getExamName());
            userMockExam.setScore(userMockExam1.getScore());
            userMockExam.setTotalTime(userMockExam1.getTotalTime());
            return userMockExam;
        }
        return null;
    }

    @Override
    public List<UserMockExam> getAggregatedResults(Long userId) {
        // Fetch all UserMockExam records by userId
        List<UserMockExam> userMockExams = userMockExamRepository.findByUser_Id(userId);

        // If no results are found, return an empty list or handle as needed
        if (userMockExams.isEmpty()) {
            return Collections.emptyList();
        }

        // Initialize the UserMockExam objects for each fixed examName without accents
        UserMockExam capXa = new UserMockExam();
        capXa.setUserMockExamId(0L);
        capXa.setExamName("Cấp Phường/Xã");  // Use examName without accents
        capXa.setScore(0.0);
        capXa.setTotalTime(Time.valueOf(LocalTime.of(0, 0)));  // Initialize with zero time

        UserMockExam capHuyen = new UserMockExam();
        capHuyen.setUserMockExamId(0L);
        capHuyen.setExamName("Cấp Quận/Huyện");  // Use examName without accents
        capHuyen.setScore(0.0);
        capHuyen.setTotalTime(Time.valueOf(LocalTime.of(0, 0)));  // Initialize with zero time

        UserMockExam capTinh = new UserMockExam();
        capTinh.setUserMockExamId(0L);
        capTinh.setExamName("Cấp Tỉnh/Thành phố");  // Use examName without accents
        capTinh.setScore(0.0);
        capTinh.setTotalTime(Time.valueOf(LocalTime.of(0, 0)));  // Initialize with zero time

        // Map to hold the results for each examName without accents
        Map<String, UserMockExam> aggregatedResults = new HashMap<>();
        aggregatedResults.put("Cấp Phường/Xã", capXa);
        aggregatedResults.put("Cấp Quận/Huyện", capHuyen);
        aggregatedResults.put("Cấp Tỉnh/Thành phố", capTinh);

        // Aggregate data for each examName
        for (UserMockExam exam : userMockExams) {
            String examName = exam.getExamName();

            // Check if the examName matches one of the fixed names without accents
            if (aggregatedResults.containsKey(examName)) {
                UserMockExam existingResult = aggregatedResults.get(examName);

                // Aggregate the score and total time for this exam
                existingResult.setScore(existingResult.getScore() + exam.getScore());

                // Add the total time by converting to LocalTime and back to Time
                LocalTime existingLocalTime = existingResult.getTotalTime().toLocalTime();
                LocalTime newExamLocalTime = exam.getTotalTime().toLocalTime();
                LocalTime combinedLocalTime = existingLocalTime.plusHours(newExamLocalTime.getHour())
                        .plusMinutes(newExamLocalTime.getMinute())
                        .plusSeconds(newExamLocalTime.getSecond());

                existingResult.setTotalTime(Time.valueOf(combinedLocalTime));
                existingResult.setUserMockExamId(existingResult.getUserMockExamId() + 1);
            }
        }
        List<UserMockExam> filteredResults = new ArrayList<>();
        for (UserMockExam result : aggregatedResults.values()) {
            if (result.getUserMockExamId() != 0L) {
                filteredResults.add(result);
            }
        }

        // Return the filtered list, removing any exam results with userMockExamId == 0
        return filteredResults;
    }

    @Override
    public Double getScores(Long mockExamId, Long time) {
        LocalTime localTime = LocalTime.ofSecondOfDay(time);
        Time timeSpent = Time.valueOf(localTime);
        UserMockExam ue = userMockExamRepository.findByUserMockExamId(mockExamId).get();
        ue.setTotalTime(timeSpent);
        userMockExamRepository.save(ue);
        return ue.getScore();
    }

    @Override
    public Long addUserMockExam(Long userId, Long mockExamId) {
        MockExam e = mockExamRepository.findById(mockExamId).orElse(null);
        User u = userService.getUserById(userId);
        UserMockExam uem = new UserMockExam();
        uem.setUser(u);
        uem.setTotalTime(Time.valueOf("00:45:00"));
        uem.setMockExam(e);
        uem.setUser(userService.getUserById(userId));
        uem.setExamName(e.getExamName());
        uem.setScore(0.0);
        UserMockExam us = userMockExamRepository.save(uem);
        return us.getUserMockExamId();
    }

}

