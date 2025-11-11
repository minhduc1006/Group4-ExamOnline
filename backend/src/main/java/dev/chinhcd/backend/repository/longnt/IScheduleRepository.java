package dev.chinhcd.backend.repository.longnt;

import dev.chinhcd.backend.models.longnt.Schedule;
import jdk.jfr.Registered;
import org.springframework.data.jpa.repository.JpaRepository;

@Registered
public interface IScheduleRepository extends JpaRepository<Schedule, Long> {

}
