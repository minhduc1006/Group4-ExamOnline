package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.models.duclm.UserPractice;
import dev.chinhcd.backend.repository.duclm.IUserPracticeRepository;
import dev.chinhcd.backend.services.duclm.IUserPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserPracticeService implements IUserPracticeService {

    private final IUserPracticeRepository userPracticeRepository;

    @Override
    public Integer getPracticeInfoByUserId(Long id) {

        // Tìm UserPractice theo userId
        Optional<UserPractice> userPractice = userPracticeRepository.findByUserId(id);

        // Nếu tìm thấy, trả về practiceId
        if (userPractice.isPresent()) {
            return userPractice.get().getPractice().getPracticeId();  // Chỉ trả về practiceId
        }

        return null;
    }
}
