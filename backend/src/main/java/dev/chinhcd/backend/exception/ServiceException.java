package dev.chinhcd.backend.exception;

import dev.chinhcd.backend.enums.ErrorCode;
import lombok.Getter;
import lombok.Setter;

@Getter
public class ServiceException extends RuntimeException {
    private final ErrorCode errorCode;

    public ServiceException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

}
