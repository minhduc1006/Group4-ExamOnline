package dev.chinhcd.backend.dtos.response;

import java.util.List;

public record PaginateUserResponse(
        List<UserResponse> users,
        int totalPages,
        long totalItems,
        int currentPage,
        int pageSize
) {

}
