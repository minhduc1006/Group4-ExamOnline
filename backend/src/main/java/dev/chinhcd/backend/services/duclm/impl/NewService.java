package dev.chinhcd.backend.services.duclm.impl;


import dev.chinhcd.backend.models.duclm.New;
import dev.chinhcd.backend.repository.duclm.INewRespository;
import dev.chinhcd.backend.services.duclm.INewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewService implements INewService {

    private final INewRespository iNewRespository;

    @Override
    public List<New> getThreeNews() {
        return iNewRespository.findThreeNews();
    }
}
