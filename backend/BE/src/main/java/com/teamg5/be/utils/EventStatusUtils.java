package com.teamg5.be.utils;

import java.time.LocalDate;

public final class EventStatusUtils {
    public static final String UPCOMING = "UPCOMING";
    public static final String ACTIVE = "ACTIVE";
    public static final String EXPIRED = "EXPIRED";
    public static final String HIDDEN = "HIDDEN";

    private EventStatusUtils() {
    }

    public static String resolveByDate(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        if (startDate != null && today.isBefore(startDate)) {
            return UPCOMING;
        }

        if (endDate != null && today.isAfter(endDate)) {
            return EXPIRED;
        }

        return ACTIVE;
    }

    public static String resolve(String currentStatus, LocalDate startDate, LocalDate endDate) {
        if (HIDDEN.equalsIgnoreCase(currentStatus)) {
            return HIDDEN;
        }

        return resolveByDate(startDate, endDate);
    }
}
