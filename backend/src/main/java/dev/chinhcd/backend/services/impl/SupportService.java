package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.SupportRequestRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateSupportResponse;
import dev.chinhcd.backend.dtos.response.longnt.PaginateSupportUser;
import dev.chinhcd.backend.dtos.response.longnt.SupportRequestDTO;
import dev.chinhcd.backend.models.SupportRequest;
import dev.chinhcd.backend.models.User;
import dev.chinhcd.backend.repository.ISupportRequestRepository;
import dev.chinhcd.backend.services.ISupportService;
import dev.chinhcd.backend.services.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupportService implements ISupportService {
    private final ISupportRequestRepository supportRequestRepository;
    private final IUserService userService;

    @Override
    public Boolean sendSupportRequest(SupportRequestRequest request) {
        User user = userService.getUserByUsername(request.username());
        SupportRequest sr = new SupportRequest();
        sr.setStatus("close");
        sr.setUser(user);
        sr.setName(request.name());
        sr.setEmail(request.email());
        sr.setDetail(request.detail());
        sr.setIssueCategory(request.issueCategory());
        sr.setDateCreated(new Date(System.currentTimeMillis()));
        supportRequestRepository.save(sr);
        return true;
    }


    @Override
    public String getSupportAnswer(Long id) {
        Optional<SupportRequest> supportRequestOptional = supportRequestRepository.findById(id);
        if (supportRequestOptional.isPresent()) {
            SupportRequest supportRequest = supportRequestOptional.get();
            return supportRequest.getSupportAnswer() != null ? supportRequest.getSupportAnswer() : "N/A";
        }
        return "N/A";
    }

    @Override
    public Boolean updateSupportAnswerAndStatus(Long id, String newAnswer) {
        Optional<SupportRequest> supportRequestOptional = supportRequestRepository.findById(id);
        if (supportRequestOptional.isEmpty()) {
            return false;
        }
        SupportRequest supportRequest = supportRequestOptional.get();
        supportRequest.setSupportAnswer(newAnswer);
        if (supportRequest.getStatus().equals("close")) {
            supportRequest.setStatus("open");
        }
        supportRequestRepository.save(supportRequest);
        return true;
    }

    @Override
    public PaginateSupportResponse getSupportRequestsFiltered(String status, String issueCategory, int page, int pageSize) {
        Page<SupportRequest> resultPage = supportRequestRepository.findFilteredSupportRequests(
                status, issueCategory, PageRequest.of(page - 1, pageSize));
        return new PaginateSupportResponse(
                resultPage.getContent(),
                resultPage.getTotalPages(),
                resultPage.getTotalElements(),
                page,
                pageSize
        );
    }

    @Override
    public PaginateSupportUser getSupportRequestsByUserId(Long userId, int page, int pageSize) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid userId: " + userId);
        }
        PageRequest pageRequest = PageRequest.of(page - 1, pageSize, Sort.by("dateCreated").descending());
        Page<SupportRequest> supportRequestPage = supportRequestRepository.findByUserId(userId, pageRequest);

        List<SupportRequestDTO> supportRequestDTOs = supportRequestPage.getContent().stream()
                .map(sr -> new SupportRequestDTO(
                        sr.getId(),
                        sr.getDetail(),
                        sr.getIssueCategory(),
                        sr.getSupportAnswer(),
                        sr.getDateCreated() != null
                                ? sr.getDateCreated().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE)
                                : null,
                        sr.getStatus()
                ))
                .collect(Collectors.toList());

        return new PaginateSupportUser(
                supportRequestDTOs,
                supportRequestPage.getTotalPages(),
                (int) supportRequestPage.getTotalElements(),
                supportRequestPage.getNumber() + 1,
                supportRequestPage.getSize()
        );
    }
}
