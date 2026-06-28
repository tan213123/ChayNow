package com.teamg5.be.service;

import com.teamg5.be.dto.CreateReportRequest;
import com.teamg5.be.dto.ReportResponse;
import com.teamg5.be.entity.Report;
import com.teamg5.be.entity.ReportStatus;
import com.teamg5.be.entity.ReportTargetType;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.CommentRepository;
import com.teamg5.be.repository.PostingRepository;
import com.teamg5.be.repository.ReportRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.ReviewRepository;
import com.teamg5.be.repository.UserRepository;
import com.teamg5.be.service.impl.ReportServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ReportServiceTest {

    @InjectMocks
    private ReportServiceImpl reportService;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private PostingRepository postingRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User currentUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);

        currentUser = User.builder()
                .email("user@example.com")
                .fullName("User Reporter")
                .build();
        currentUser.setId(1L);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);
        when(authentication.getName()).thenReturn(currentUser.getEmail());
        when(userRepository.findByEmail(currentUser.getEmail())).thenReturn(Optional.of(currentUser));
    }

    @AfterEach
    public void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void createReport_RestaurantSuccess() {
        // Arrange
        CreateReportRequest request = CreateReportRequest.builder()
                .targetType(ReportTargetType.RESTAURANT)
                .targetId(10L)
                .reason("Spam / Fake Restaurant")
                .details("This restaurant does not exist at the location.")
                .build();

        when(restaurantRepository.existsById(10L)).thenReturn(true);

        Report report = Report.builder()
                .reporter(currentUser)
                .targetType(ReportTargetType.RESTAURANT)
                .targetId(10L)
                .reason(request.getReason())
                .details(request.getDetails())
                .status(ReportStatus.PENDING)
                .build();
        report.setId(100L);

        when(reportRepository.save(any(Report.class))).thenReturn(report);

        // Act
        ReportResponse response = reportService.createReport(request);

        // Assert
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("user@example.com", response.getReporterEmail());
        assertEquals("RESTAURANT", response.getTargetType());
        assertEquals(10L, response.getTargetId());
        assertEquals("Spam / Fake Restaurant", response.getReason());
        assertEquals("PENDING", response.getStatus());

        verify(restaurantRepository, times(1)).existsById(10L);
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    public void createReport_RestaurantNotFound_ThrowsException() {
        // Arrange
        CreateReportRequest request = CreateReportRequest.builder()
                .targetType(ReportTargetType.RESTAURANT)
                .targetId(999L)
                .reason("Spam")
                .build();

        when(restaurantRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> reportService.createReport(request));
        assertEquals(ErrorCode.RESTAURANT_NOT_FOUND, exception.getErrorCode());
        assertEquals("Không tìm thấy nhà hàng này", exception.getMessage());

        verify(restaurantRepository, times(1)).existsById(999L);
        verify(reportRepository, never()).save(any(Report.class));
    }

    @Test
    public void createReport_Unauthorized_ThrowsException() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(null);

        CreateReportRequest request = CreateReportRequest.builder()
                .targetType(ReportTargetType.RESTAURANT)
                .targetId(10L)
                .reason("Spam")
                .build();

        // Act & Assert
        assertThrows(AppException.class, () -> reportService.createReport(request));
        verify(reportRepository, never()).save(any(Report.class));
    }
}
