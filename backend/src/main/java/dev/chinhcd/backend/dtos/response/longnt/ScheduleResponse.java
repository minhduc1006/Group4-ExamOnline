package dev.chinhcd.backend.dtos.response.longnt;

import dev.chinhcd.backend.models.longnt.Schedule;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class ScheduleResponse {
    private List<Schedule> schedule;
}