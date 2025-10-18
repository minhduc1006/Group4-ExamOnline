package dev.chinhcd.backend.services.impl.longnt;

import dev.chinhcd.backend.dtos.response.longnt.ScheduleResponse;
import dev.chinhcd.backend.models.longnt.Schedule;
import dev.chinhcd.backend.repository.longnt.IScheduleRepository;
import dev.chinhcd.backend.services.longnt.IScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService implements IScheduleService {

    private final IScheduleRepository scheduleRepository;

    @Override
    public ScheduleResponse getAllSchedules() {
        List<Schedule> schedules = scheduleRepository.getAllSchedules();
        return new ScheduleResponse(schedules);
    }

}
