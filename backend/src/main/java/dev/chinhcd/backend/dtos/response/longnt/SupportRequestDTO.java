package dev.chinhcd.backend.dtos.response.longnt;

public record SupportRequestDTO(
        Long id,
        String detail,
        String issueCategory,
        String supportAnswer,
        String dateCreated,
        String status
) {
}
