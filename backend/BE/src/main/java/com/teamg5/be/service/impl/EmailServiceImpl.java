package com.teamg5.be.service.impl;

import com.teamg5.be.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Async
    @Override
    public void sendVerificationEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("ChayNow - Mã xác thực địa chỉ email của bạn");
        message.setText("Chào bạn,\n\nMã xác thực địa chỉ email của bạn là: " + code + 
                "\n\nVui lòng nhập mã này trên trang web để hoàn tất đăng ký.\n\nCảm ơn,\nĐội ngũ ChayNow");

        mailSender.send(message);
    }
}
