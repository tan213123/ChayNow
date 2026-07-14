package com.teamg5.be.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    INTERNAL_SERVER_ERROR("ERR_INTERNAL_SERVER", "Đã xảy ra lỗi không mong muốn", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_INPUT("ERR_INVALID_INPUT", "Dữ liệu đầu vào không hợp lệ", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED("ERR_UNAUTHORIZED", "Truy cập không được phép", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("ERR_FORBIDDEN", "Từ chối truy cập", HttpStatus.FORBIDDEN),
    NOT_FOUND("ERR_NOT_FOUND", "Không tìm thấy tài nguyên", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("ERR_USER_EXISTS", "Người dùng đã tồn tại", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS("ERR_INVALID_CREDENTIALS", "Tên đăng nhập hoặc mật khẩu không chính xác", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("USER_NOT_FOUND", "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    TYPE_RESTAURANT_NOT_FOUND(
            "ERR_TYPE_RESTAURANT_NOT_FOUND",
            "Không tìm thấy loại nhà hàng",
            HttpStatus.NOT_FOUND
    ),
    TYPE_RESTAURANT_ALREADY_EXISTS(
            "ERR_TYPE_RESTAURANT_ALREADY_EXISTS",
            "Loại nhà hàng này đã tồn tại",
            HttpStatus.BAD_REQUEST
    ),
    RESTAURANT_NOT_FOUND(
            "ERR_RESTAURANT_NOT_FOUND",
            "Không tìm thấy nhà hàng này",
            HttpStatus.NOT_FOUND
    ),
    RESTAURANT_ALREADY_EXISTS(
            "ERR_RESTAURANT_ALREADY_EXISTS",
            "Nhà hàng này đã tồn tại (trùng tên và địa chỉ)",
            HttpStatus.BAD_REQUEST
    ),
    REVIEW_ALREADY_EXISTS(
            "ERR_REVIEW_ALREADY_EXISTS",
            "Bạn đã đánh giá nhà hàng này rồi",
            HttpStatus.BAD_REQUEST
    ),
    OWNER_CANNOT_REVIEW(
            "ERR_OWNER_CANNOT_REVIEW",
            "Chủ nhà hàng không thể đánh giá nhà hàng của chính mình",
            HttpStatus.BAD_REQUEST
    ),
    POSTING_NOT_FOUND("ERR_POSTING_NOT_FOUND", "Không tìm thấy bài đăng này", HttpStatus.NOT_FOUND),
    PLACE_NOT_FOUND("ERR_PLACE_NOT_FOUND", "Không tìm thấy địa điểm/vị trí này", HttpStatus.NOT_FOUND),
    PLACE_ALREADY_EXISTS("ERR_PLACE_ALREADY_EXISTS", "Địa điểm này đã tồn tại", HttpStatus.BAD_REQUEST),
    PLACE_IN_USE(
            "ERR_PLACE_IN_USE",
            "Không thể xóa địa điểm này vì nhà hàng vẫn đang hoạt động.",
            HttpStatus.BAD_REQUEST
    ),
    REVIEW_NOT_FOUND(
            "REVIEW_NOT_FOUND",
            "Không tìm thấy đánh giá này",
            HttpStatus.BAD_REQUEST
    ),
    COMMENT_NOT_FOUND(
            "ERR_COMMENT_NOT_FOUND",
            "Không tìm thấy bình luận này",
            HttpStatus.NOT_FOUND
    ),
    MENU_NOT_FOUND(
            "ERR_MENU_NOT_FOUND",
            "Không tìm thấy món ăn này",
            HttpStatus.NOT_FOUND
    ),
    EVENT_NOT_FOUND(
            "ERR_EVENT_NOT_FOUND",
            "Không tìm thấy sự kiện này",
            HttpStatus.NOT_FOUND
    ),
    EVENT_FORBIDDEN(
            "ERR_EVENT_FORBIDDEN",
            "Bạn không có quyền quản lý sự kiện này",
            HttpStatus.FORBIDDEN
    ),
    UPLOAD_FAILED(
            "ERR_UPLOAD_FAILED",
            "Tải tập tin lên Cloudinary thất bại",
            HttpStatus.INTERNAL_SERVER_ERROR
    ),
    EMPTY_FILE(
            "ERR_EMPTY_FILE",
            "Tập tin tải lên bị trống",
            HttpStatus.BAD_REQUEST
    );

    private final String code;
    private final String defaultMessage;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String defaultMessage, HttpStatus httpStatus) {
        this.code = code;
        this.defaultMessage = defaultMessage;
        this.httpStatus = httpStatus;
    }
}
