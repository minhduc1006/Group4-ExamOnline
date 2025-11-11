package dev.chinhcd.backend.controllers.longnt;

import dev.chinhcd.backend.dtos.response.longnt.ScheduleResponse;
import dev.chinhcd.backend.services.longnt.IScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final IScheduleService scheduleService;

    @GetMapping("/all")
    public ResponseEntity<ScheduleResponse> getSchedule() {
        ScheduleResponse response = scheduleService.getSchedule();
        return ResponseEntity.ok(response);
    }

}
