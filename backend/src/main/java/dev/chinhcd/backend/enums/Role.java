package dev.chinhcd.backend.enums;

public enum Role {
    USER("user"),
    QUIZ_MANAGER("quiz_manager"),
    ADMIN("admin");
    private String role;

    Role(String role) {
        this.role = role;
    }
}
