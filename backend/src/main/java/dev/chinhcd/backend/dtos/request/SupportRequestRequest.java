package dev.chinhcd.backend.dtos.request;

public record SupportRequestRequest(
        String username,
        String name,
        String issueCategory,
        String email,
        String detail
) {
}
