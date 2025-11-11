package dev.chinhcd.backend.dtos.response.longnt;

import dev.chinhcd.backend.models.SupportRequest;

import java.util.List;

public record PaginateSupportResponse(
        List<SupportRequest> supportRequests,
        int totalPages,
        long totalItems,
        int currentPage,
        int pageSize
) {
}
