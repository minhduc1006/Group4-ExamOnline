package dev.chinhcd.backend.repository.duclm;

import dev.chinhcd.backend.models.duclm.New;
import dev.chinhcd.backend.models.duclm.Tip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ITipRespository extends JpaRepository<New, Long> {

    @Query("SELECT n FROM Tip n ORDER BY n.id DESC LIMIT 3")
    List<Tip> findThreeTips();

}
