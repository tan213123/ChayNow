package com.teamg5.be.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateUtils {

    private static final DateTimeFormatter STANDARD_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private static final DateTimeFormatter DOUBLE_DASH_FORMATTER = DateTimeFormatter.ofPattern("dd--MM--yyyy");

    public static String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(STANDARD_FORMATTER);
    }

    public static String formatLocalDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(STANDARD_FORMATTER);
    }

    public static String formatDateDoubleDash(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DOUBLE_DASH_FORMATTER);
    }

    public static String formatLocalDateTimeDoubleDash(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DOUBLE_DASH_FORMATTER);
    }

    public static String format(LocalDate date, String pattern) {
        if (date == null || pattern == null) {
            return null;
        }
        return date.format(DateTimeFormatter.ofPattern(pattern));
    }
}
