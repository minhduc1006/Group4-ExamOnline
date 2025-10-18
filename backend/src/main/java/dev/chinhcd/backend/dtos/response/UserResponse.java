package dev.chinhcd.backend.dtos.response;

import lombok.Builder;

import java.sql.Date;

@Builder
public record UserResponse(
        Long id,
        String username,
        String name,
        String gender,
        Date birthDate,
        String email,
        String role,
        String province,
        String district,
        String ward,
        Integer grade,
        String accountType,
        String educationLevel,
        Boolean isDoingExam
) {
}
