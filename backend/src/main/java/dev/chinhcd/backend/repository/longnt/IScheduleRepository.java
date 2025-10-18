package dev.chinhcd.backend.repository.longnt;

import dev.chinhcd.backend.models.longnt.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s ORDER BY s.examDate ASC")
    List<Schedule> getAllSchedules();

}
