package dev.chinhcd.backend.dtos.request;

import java.sql.Date;

public record UserRequest(
        Long id,
        String username,
        String name,
        String gender,
        Date birthDate,
        String email,
        String password,
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
