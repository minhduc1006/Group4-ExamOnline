package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.repository.duclm.IExamRespository;
import dev.chinhcd.backend.services.duclm.IExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExamService implements IExamService {

    private final IExamRespository examRespository;


    @Override
    public Integer getMaxLevel() {
        return (examRespository.findMaxLevel().orElse(0));
    }
}
