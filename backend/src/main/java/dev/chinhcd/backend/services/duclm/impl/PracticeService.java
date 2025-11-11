package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.models.duclm.UserPractice;
import dev.chinhcd.backend.repository.duclm.IPracticeRepository;
import dev.chinhcd.backend.repository.duclm.IUserPracticeRepository;
import dev.chinhcd.backend.services.duclm.IPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PracticeService implements IPracticeService {

    private final IUserPracticeRepository userPracticeRepository;
    private final IPracticeRepository practiceRepository;

    @Override
    public boolean isUserCompleted(Long userId) {
        UserPractice userPractice =  userPracticeRepository.findByUserId(userId).get();
        if (userPractice.getTotalScore() != 0) {
            Practice practice = practiceRepository.findById((long) userPractice.getPractice().getPracticeId()).get();
            return  practice.getPracticeLevel() == practiceRepository.findMaxLevel().get();
        }
        return false;
    }


    @Override
    public Integer getMaxLevel() {
        return (practiceRepository.findMaxLevel().orElse(0));
    }
}
