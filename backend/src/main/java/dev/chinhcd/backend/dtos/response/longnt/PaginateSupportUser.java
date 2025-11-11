package dev.chinhcd.backend.dtos.response.longnt;

import java.util.List;

public record PaginateSupportUser(
        List<SupportRequestDTO> supportRequests,
        int totalPages,
        int totalItems,
        int currentPage,
        int pageSize
) {
}
