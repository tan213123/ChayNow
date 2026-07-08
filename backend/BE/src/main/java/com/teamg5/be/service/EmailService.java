package com.teamg5.be.service;

public interface EmailService {
    void sendVerificationEmail(String to, String token);
}
