package dev.chinhcd.backend.services.longnt;

import dev.chinhcd.backend.dtos.response.longnt.ScheduleResponse;
import dev.chinhcd.backend.models.duclm.Exam;
import dev.chinhcd.backend.models.duclm.Practice;

import java.util.List;

public interface IScheduleService {

    List<Practice> getPracticeByLevel(int level);

    // Thêm phương thức lấy Exam theo examName
    List<Exam> getExamsByExamName(String examName);

    // Thêm phương thức kết hợp dữ liệu (Practice + Exam)
    ScheduleResponse getSchedule();


}
