package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.repository.duclm.IPracticeRepository;
import dev.chinhcd.backend.services.duclm.IPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PracticeService implements IPracticeService {

    private final IPracticeRepository practiceRespository;


    @Override
    public Integer getMaxLevel() {
        return (practiceRespository.findMaxLevel().orElse(0));
    }
}
