package com.teamg5.be.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamg5.be.dto.CreateFoodPostRequest;
import com.teamg5.be.dto.FoodPostResponse;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.service.OwnerFoodPostService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;

import com.teamg5.be.security.JwtService;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.teamg5.be.security.JwtAuthenticationEntryPoint;
import com.teamg5.be.security.JwtAccessDeniedHandler;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OwnerFoodPostController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OwnerFoodPostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private OwnerFoodPostService ownerFoodPostService;

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

    @Test
    public void createFoodPost_Success() throws Exception {
        CreateFoodPostRequest request = CreateFoodPostRequest.builder()
                .restaurantId(1L)
                .name("Bún riêu chay đặc biệt")
                .category("MAIN_DISH")
                .description("Món bún riêu chay được nấu từ rau củ, đậu hũ và nước dùng thanh ngọt.")
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .build();

        FoodPostResponse response = FoodPostResponse.builder()
                .id(101L)
                .restaurantId(1L)
                .name("Bún riêu chay đặc biệt")
                .category("MAIN_DISH")
                .description("Món bún riêu chay được nấu từ rau củ, đậu hũ và nước dùng thanh ngọt.")
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        when(ownerFoodPostService.createFoodPost(any(CreateFoodPostRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/owner/food-posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(101L))
                .andExpect(jsonPath("$.data.name").value("Bún riêu chay đặc biệt"))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }

    @Test
    public void createFoodPost_NotOwner_Forbidden() throws Exception {
        CreateFoodPostRequest request = CreateFoodPostRequest.builder()
                .restaurantId(1L)
                .name("Bún riêu chay đặc biệt")
                .category("MAIN_DISH")
                .description("Món bún riêu chay được nấu từ rau củ, đậu hũ và nước dùng thanh ngọt.")
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .build();

        when(ownerFoodPostService.createFoodPost(any(CreateFoodPostRequest.class)))
                .thenThrow(new AppException(ErrorCode.FORBIDDEN, "Only users with role OWNER can post food items"));

        mockMvc.perform(post("/api/owner/food-posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void createFoodPost_RestaurantNotFound_404() throws Exception {
        CreateFoodPostRequest request = CreateFoodPostRequest.builder()
                .restaurantId(999L)
                .name("Bún riêu chay đặc biệt")
                .category("MAIN_DISH")
                .description("Món bún riêu chay được nấu từ rau củ, đậu hũ và nước dùng thanh ngọt.")
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .build();

        when(ownerFoodPostService.createFoodPost(any(CreateFoodPostRequest.class)))
                .thenThrow(new AppException(ErrorCode.RESTAURANT_NOT_FOUND, "Restaurant not found with ID: 999"));

        mockMvc.perform(post("/api/owner/food-posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    public void createFoodPost_NotRestaurantOwner_Forbidden() throws Exception {
        CreateFoodPostRequest request = CreateFoodPostRequest.builder()
                .restaurantId(2L)
                .name("Bún riêu chay đặc biệt")
                .category("MAIN_DISH")
                .description("Món bún riêu chay được nấu từ rau củ, đậu hũ và nước dùng thanh ngọt.")
                .imageUrl("https://res.cloudinary.com/test.jpg")
                .build();

        when(ownerFoodPostService.createFoodPost(any(CreateFoodPostRequest.class)))
                .thenThrow(new AppException(ErrorCode.FORBIDDEN, "You do not own this restaurant"));

        mockMvc.perform(post("/api/owner/food-posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void createFoodPost_ValidationErrors_400() throws Exception {
        // Missing name and invalid URL
        CreateFoodPostRequest request = CreateFoodPostRequest.builder()
                .restaurantId(1L)
                .category("MAIN_DISH")
                .description("Món ăn") // Less than 10 characters
                .imageUrl("invalid-url")
                .build();

        mockMvc.perform(post("/api/owner/food-posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void getFoodCategories_Success() throws Exception {
        when(ownerFoodPostService.getFoodCategories()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/owner/food-categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
