package com.teamg5.be.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.teamg5.be.dto.CreateEventRequest;
import com.teamg5.be.dto.OwnerEventResponse;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.service.OwnerEventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.teamg5.be.security.JwtService;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.teamg5.be.security.JwtAuthenticationEntryPoint;
import com.teamg5.be.security.JwtAccessDeniedHandler;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OwnerEventController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OwnerEventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private OwnerEventService ownerEventService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockitoBean
    private JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @MockitoBean
    private CorsConfigurationSource corsConfigurationSource;

    @BeforeEach
    public void setup() {
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    public void createEvent_Discount_Success() throws Exception {
        CreateEventRequest request = CreateEventRequest.builder()
                .restaurantId(1L)
                .type("DISCOUNT")
                .title("Giảm giá 20% tất cả món ăn")
                .description("Áp dụng cho toàn bộ món chính trong tuần lễ ăn chay.")
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(5))
                .discountPercent(20)
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .build();

        OwnerEventResponse response = OwnerEventResponse.builder()
                .id(101L)
                .restaurantId(1L)
                .type("DISCOUNT")
                .title("Giảm giá 20% tất cả món ăn")
                .description("Áp dụng cho toàn bộ món chính trong tuần lễ ăn chay.")
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(5))
                .discountPercent(20)
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        when(ownerEventService.createOwnerEvent(any(CreateEventRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/owner/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(101L))
                .andExpect(jsonPath("$.data.discountPercent").value(20))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));
    }

    @Test
    public void createEvent_Charity_Success() throws Exception {
        CreateEventRequest request = CreateEventRequest.builder()
                .restaurantId(1L)
                .type("CHARITY")
                .title("Sự kiện từ thiện Vu Lan")
                .description("Phát cơm chay từ thiện miễn phí cho người nghèo.")
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(2))
                .period("11:00-13:00 hàng ngày")
                .charityTime("11:00 - 12:00 hằng ngày")
                .discountPercent(null)
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .build();

        OwnerEventResponse response = OwnerEventResponse.builder()
                .id(102L)
                .restaurantId(1L)
                .type("CHARITY")
                .title("Sự kiện từ thiện Vu Lan")
                .description("Phát cơm chay từ thiện miễn phí cho người nghèo.")
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(2))
                .period("11:00-13:00 hàng ngày")
                .charityTime("11:00 - 12:00 hằng ngày")
                .discountPercent(null)
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        when(ownerEventService.createOwnerEvent(any(CreateEventRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/owner/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(102L))
                .andExpect(jsonPath("$.data.period").value("11:00-13:00 hàng ngày"))
                .andExpect(jsonPath("$.data.charityTime").value("11:00 - 12:00 hằng ngày"))
                .andExpect(jsonPath("$.data.discountPercent").isEmpty());
    }

    @Test
    public void createEvent_NotOwner_Forbidden() throws Exception {
        CreateEventRequest request = CreateEventRequest.builder()
                .restaurantId(1L)
                .type("DISCOUNT")
                .title("Giảm giá 20% tất cả món ăn")
                .description("Áp dụng cho toàn bộ món chính trong tuần lễ ăn chay.")
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(5))
                .discountPercent(20)
                .build();

        when(ownerEventService.createOwnerEvent(any(CreateEventRequest.class)))
                .thenThrow(new AppException(ErrorCode.FORBIDDEN, "Only users with role OWNER can create events"));

        mockMvc.perform(post("/api/owner/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void createEvent_RestaurantNotFound_404() throws Exception {
        CreateEventRequest request = CreateEventRequest.builder()
                .restaurantId(999L)
                .type("DISCOUNT")
                .title("Giảm giá 20% tất cả món ăn")
                .description("Áp dụng cho toàn bộ món chính trong tuần lễ ăn chay.")
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(5))
                .discountPercent(20)
                .build();

        when(ownerEventService.createOwnerEvent(any(CreateEventRequest.class)))
                .thenThrow(new AppException(ErrorCode.RESTAURANT_NOT_FOUND, "Restaurant not found"));

        mockMvc.perform(post("/api/owner/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void createEvent_ValidationErrors_400() throws Exception {
        // Missing title & invalid dates
        CreateEventRequest request = CreateEventRequest.builder()
                .restaurantId(1L)
                .type("DISCOUNT")
                .description("Mô tả ngắn")
                .startDate(LocalDate.now().minusDays(5)) // past date
                .endDate(LocalDate.now().minusDays(10))
                .discountPercent(20)
                .build();

        mockMvc.perform(post("/api/owner/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
