package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.SupportRequestRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateSupportResponse;
import dev.chinhcd.backend.dtos.response.longnt.PaginateSupportUser;

public interface ISupportService {
    Boolean sendSupportRequest(SupportRequestRequest request);

    PaginateSupportResponse getSupportRequestsFiltered(String status, String issueCategory, int page, int pageSize);

    String getSupportAnswer(Long id);

    Boolean updateSupportAnswerAndStatus(Long id, String newAnswer);

    PaginateSupportUser getSupportRequestsByUserId(Long userId, int page, int pageSize);
}
