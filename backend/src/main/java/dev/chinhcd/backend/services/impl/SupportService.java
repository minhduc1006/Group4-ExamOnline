package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.SupportRequestRequest;
import dev.chinhcd.backend.models.SupportRequest;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.ISupportRequestRepository;
import dev.chinhcd.backend.services.ISupportService;
import dev.chinhcd.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;

@Service
@RequiredArgsConstructor
public class SupportService implements ISupportService {
    private final ISupportRequestRepository supportRequestRepository;
    private final IUserService userService;

    @Override
    public Boolean sendSupportRequest(SupportRequestRequest request) {
        User user = userService.getUserByUsername(request.username());
        SupportRequest sr = new SupportRequest();
        sr.setUser(user);
        sr.setName(request.name());
        sr.setEmail(request.email());
        sr.setDetail(request.detail());
        sr.setIssueCategory(request.issueCategory());
        sr.setDateCreated(new Date(System.currentTimeMillis()));
        supportRequestRepository.save(sr);
        return true;
    }
}
