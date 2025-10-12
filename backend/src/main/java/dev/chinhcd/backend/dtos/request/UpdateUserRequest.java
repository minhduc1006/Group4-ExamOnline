package dev.chinhcd.backend.dtos.request;

import java.sql.Date;

public record UpdateUserRequest(
        Long id,
        String name,
        String gender,
        Date birthDate,
        String grade,
        String province,
        String district,
        String ward,
        String educationLevel
) {
}
