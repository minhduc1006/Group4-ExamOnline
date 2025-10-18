package dev.chinhcd.backend.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(HttpStatus.INTERNAL_SERVER_ERROR, "Service Error"),
    EMAIL_EXISTED(HttpStatus.BAD_REQUEST, "Email Already Taken"),
    USER_EXISTED(HttpStatus.BAD_REQUEST, "Username Already Taken"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User Not Found"),
    UNAUTHENTICATED(HttpStatus.UNAUTHORIZED, "Unauthenticated"),
    UNAUTHORIZED(HttpStatus.FORBIDDEN, "You Do Not Have Permission"),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "Invalid Refresh Token"),
    WRONG_PASSWORD(HttpStatus.UNAUTHORIZED, "Wrong Password");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
