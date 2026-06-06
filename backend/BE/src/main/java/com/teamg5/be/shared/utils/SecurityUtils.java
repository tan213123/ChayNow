package com.teamg5.be.shared.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public class SecurityUtils {

    private SecurityUtils() {
        // Private constructor to prevent instantiation
    }

    public static Optional<String> getCurrentUserLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return Optional.ofNullable(authentication)
                .map(auth -> {
                    if (auth.getPrincipal() instanceof UserDetails userDetails) {
                        return userDetails.getUsername();
                    } else if (auth.getPrincipal() instanceof String principalStr) {
                        return principalStr;
                    }
                    return null;
                });
    }
}
