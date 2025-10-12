package dev.chinhcd.backend.dtos.request;

import dev.chinhcd.backend.enums.Role;

public record AddManagerRequest(
        String username,
        String password,
        String email,
        Role role
) {
}
