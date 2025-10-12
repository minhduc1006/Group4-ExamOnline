package dev.chinhcd.backend.enums;

public enum Role {
    STUDENT("student"),
    QUIZ_MANAGER("quiz_manager"),
    CONTENT_MANAGER("content_manager"),
    SUPPORT_MANAGER("support_manager"),
    ADMIN("admin");
    private String role;

    Role(String role) {
        this.role = role;
    }
}
