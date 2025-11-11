package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.UserPractice;

import java.util.List;

public interface IUserPracticeService {
    Integer getPracticeInfoByUserId(Long id);
    void saveUserPractice(Long userId, Integer practiceLevel);
    List<UserPractice> getResult(Long userId);
    List<UserPractice> getLevelResult(Long userId, Integer practiceLevel);

    boolean checkUserResult(Long userId, Integer level);


    List<UserPractice> getByPractice(Practice practice);

}
