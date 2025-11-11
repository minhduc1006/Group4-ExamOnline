package dev.chinhcd.backend.services.duclm.impl;

import dev.chinhcd.backend.models.duclm.Question;
import dev.chinhcd.backend.models.duclm.SmallPractice;
import dev.chinhcd.backend.models.duclm.SmallPracticeQuestion;
import dev.chinhcd.backend.repository.duclm.ISmallPracticeQuestionRepository;
import dev.chinhcd.backend.repository.duclm.ISmallPracticeRepository;
import dev.chinhcd.backend.services.duclm.ISmallPracticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class SmallPracticeService implements ISmallPracticeService {

    private final ISmallPracticeQuestionRepository smallPracticeQuestionRepository;
    private final ISmallPracticeRepository smallPracticeRepository;


    @Override
    public List<Question> getQuestionsBySmallPracticeId(Long smallPracticeId) {
        SmallPractice smallPractice = smallPracticeRepository.findById(smallPracticeId)
                .orElseThrow(() -> new RuntimeException("SmallPractice not found"));

        return smallPracticeQuestionRepository.findBySmallPractice(smallPractice).stream()
                .map(SmallPracticeQuestion::getQuestion)
                .collect(Collectors.toList());
    }
}
