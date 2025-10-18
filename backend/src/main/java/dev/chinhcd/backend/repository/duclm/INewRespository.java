package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.New;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Pageable;
import java.util.List;

public interface INewRespository extends JpaRepository<New, Long> {

    @Query("SELECT n FROM New n ORDER BY n.id DESC LIMIT 3")
    List<New> findThreeNews();

}
