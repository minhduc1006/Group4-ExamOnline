package dev.chinhcd.backend.dtos.response;

import java.util.List;

public record ListManagerResponse(
        List<UserResponse> managers,
        Long totalManager
) {
}
