package dev.chinhcd.backend.dtos.request;

public record SupportRequestRequest(
        Long userId,
        String username,
        String name,
        String issueCategory,
        String email,
        String detail
) {
}
