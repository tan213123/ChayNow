package com.teamg5.be.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    INTERNAL_SERVER_ERROR("ERR_INTERNAL_SERVER", "An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_INPUT("ERR_INVALID_INPUT", "Invalid input data", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED("ERR_UNAUTHORIZED", "Unauthorized access", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("ERR_FORBIDDEN", "Access denied", HttpStatus.FORBIDDEN),
    NOT_FOUND("ERR_NOT_FOUND", "Resource not found", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("ERR_USER_EXISTS", "User already exists", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS("ERR_INVALID_CREDENTIALS", "Invalid username or password", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String defaultMessage;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String defaultMessage, HttpStatus httpStatus) {
        this.code = code;
        this.defaultMessage = defaultMessage;
        this.httpStatus = httpStatus;
    }
}
