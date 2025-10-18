package dev.chinhcd.backend.services.duclm;

import dev.chinhcd.backend.models.duclm.New;
import dev.chinhcd.backend.models.duclm.Tip;

import java.util.List;

public interface ITipService {
    List<Tip> getThreeTips();
}
