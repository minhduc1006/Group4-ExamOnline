package dev.chinhcd.backend.services.impl.longnt;

import dev.chinhcd.backend.dtos.response.longnt.ScheduleResponse;
import dev.chinhcd.backend.models.duclm.Exam;
import dev.chinhcd.backend.models.duclm.Practice;
import dev.chinhcd.backend.repository.duclm.IExamRepository;
import dev.chinhcd.backend.repository.duclm.IPracticeRepository;
import dev.chinhcd.backend.services.longnt.IScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService implements IScheduleService {

    private final IPracticeRepository practiceRepository;
    private final IExamRepository examRepository;

    @Override
    public ScheduleResponse getSchedule() {
        List<Practice> practices = new ArrayList<>();
        List<Exam> exams = new ArrayList<>();
        for (int i = 1; i <= 15 ; i++) {
            if(!practiceRepository.getPracticeByLevel(i).isEmpty()){
                Practice practice = practiceRepository.getPracticeByLevel(i).get(0);
                practices.add(practice);
            }
        }
        String[] examNames = {"Cấp Phường/Xã", "Cấp Quận/Huyện", "Cấp Tỉnh/Thành phố"};

        for (String name : examNames) {
            if (!examRepository.getExamsByExamName(name).isEmpty()) {
                Exam exam = examRepository.getExamsByExamName(name).get(0);
                exams.add(exam);
            }
        }
        return new ScheduleResponse(practices, exams);
    }
}
