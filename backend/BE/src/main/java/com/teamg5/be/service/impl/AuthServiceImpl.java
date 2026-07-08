package com.teamg5.be.service.impl;

import com.teamg5.be.security.JwtService;
import com.teamg5.be.dto.LoginRequest;
import com.teamg5.be.dto.RegisterRequest;
import com.teamg5.be.dto.TokenResponse;
import com.teamg5.be.entity.NotificationType;
import com.teamg5.be.entity.Role;
import com.teamg5.be.entity.User;
import com.teamg5.be.event.SystemNotificationEvent;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.AuthService;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.teamg5.be.entity.VerificationToken;
import com.teamg5.be.repository.VerificationTokenRepository;
import com.teamg5.be.service.EmailService;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ApplicationEventPublisher eventPublisher;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    @Override
    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.USER)
                .isEmailVerified(false)
                .build();
        User savedUser = userRepository.save(user);
        notifyAdminsAboutNewUser(savedUser);
        
        createTokenAndSendEmail(savedUser);

        String token = jwtService.generateToken(savedUser);
        return buildTokenResponse(savedUser, token);
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy người dùng"));
                
        if (!user.getIsEmailVerified()) {
            throw new AppException(ErrorCode.FORBIDDEN, "Tài khoản chưa xác thực email");
        }
        
        String token = jwtService.generateToken(user);
        return buildTokenResponse(user, token);
    }

    @Override
    public TokenResponse registerOwner(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.OWNER)
                .isEmailVerified(false)
                .build();
        User savedUser = userRepository.save(user);
        notifyAdminsAboutNewUser(savedUser);

        createTokenAndSendEmail(savedUser);

        String token = jwtService.generateToken(savedUser);
        return buildTokenResponse(savedUser, token);
    }

    @Override
    public void verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Token không hợp lệ"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Token đã hết hạn");
        }

        User user = verificationToken.getUser();
        user.setIsEmailVerified(true);
        if (verificationToken.getNewEmail() != null && !verificationToken.getNewEmail().isEmpty()) {
            user.setEmail(verificationToken.getNewEmail());
        }
        userRepository.save(user);

        tokenRepository.delete(verificationToken);
    }

    @Override
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy người dùng"));

        if (user.getIsEmailVerified()) {
            throw new AppException(ErrorCode.INVALID_INPUT, "Email đã được xác thực");
        }

        createTokenAndSendEmail(user, null);
    }

    @Override
    public void sendVerificationEmailForChange(String oldEmail, String newEmail) {
        User user = userRepository.findByEmail(oldEmail)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy người dùng"));

        createTokenAndSendEmail(user, newEmail);
    }

    private void createTokenAndSendEmail(User user) {
        createTokenAndSendEmail(user, null);
    }

    private void createTokenAndSendEmail(User user, String newEmail) {
        String token = String.format("%06d", new java.util.Random().nextInt(999999));
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .user(user)
                .newEmail(newEmail)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepository.save(verificationToken);

        String emailToSendTo = (newEmail != null && !newEmail.isEmpty()) ? newEmail : user.getEmail();
        emailService.sendVerificationEmail(emailToSendTo, token);
    }

    private TokenResponse buildTokenResponse(User user, String token) {
        return TokenResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .id(user.getId())
                .avtUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .build();
    }

    private void notifyAdminsAboutNewUser(User user) {
        userRepository.findByRole(Role.ADMIN).forEach(admin ->
                eventPublisher.publishEvent(new SystemNotificationEvent(
                        admin,
                        "Nguoi dung moi",
                        user.getFullName() + " vua dang ky tai khoan " + user.getRole().name() + ".",
                        NotificationType.NEW_USER,
                        user.getId().toString()
                ))
        );
    }
}
