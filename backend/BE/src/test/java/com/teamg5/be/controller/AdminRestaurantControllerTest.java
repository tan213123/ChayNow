package com.teamg5.be.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.teamg5.be.dto.AdminRestaurantResponseDTO;
import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.RejectRestaurantRequestDTO;
import com.teamg5.be.security.JwtAccessDeniedHandler;
import com.teamg5.be.security.JwtAuthenticationEntryPoint;
import com.teamg5.be.security.JwtService;
import com.teamg5.be.service.AdminRestaurantService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.cors.CorsConfigurationSource;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminRestaurantController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AdminRestaurantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AdminRestaurantService adminRestaurantService;

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
    public void getAllRestaurantsForAdmin_Success() throws Exception {
        AdminRestaurantResponseDTO dto = AdminRestaurantResponseDTO.builder()
                .id(1L)
                .name("Chay Quan")
                .address("123 Street")
                .thumbnailUrl("http://img.url")
                .rating(4.5)
                .reviewCount(10)
                .status("PENDING")
                .placeId(2L)
                .placeName("District 1")
                .ownerId(3L)
                .ownerName("Owner Name")
                .createdAt(LocalDateTime.now())
                .build();

        PageResponseDTO<AdminRestaurantResponseDTO> pageResponse = PageResponseDTO.<AdminRestaurantResponseDTO>builder()
                .content(Collections.singletonList(dto))
                .page(0)
                .size(10)
                .totalElements(1L)
                .totalPages(1)
                .last(true)
                .build();

        when(adminRestaurantService.getAllRestaurants(anyString(), anyString(), anyLong(), anyInt(), anyInt()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/admin/restaurants")
                        .param("keyword", "Chay")
                        .param("status", "PENDING")
                        .param("placeId", "2")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].name").value("Chay Quan"))
                .andExpect(jsonPath("$.content[0].status").value("PENDING"))
                .andExpect(jsonPath("$.content[0].placeName").value("District 1"))
                .andExpect(jsonPath("$.content[0].ownerName").value("Owner Name"));
    }

    @Test
    public void approveRestaurant_Success() throws Exception {
        AdminRestaurantResponseDTO dto = AdminRestaurantResponseDTO.builder()
                .id(1L)
                .name("Chay Quan")
                .status("APPROVED")
                .build();

        when(adminRestaurantService.approveRestaurant(eq(1L)))
                .thenReturn(dto);

        mockMvc.perform(put("/api/admin/restaurants/1/approve")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }

    @Test
    public void rejectRestaurant_Success() throws Exception {
        RejectRestaurantRequestDTO requestDTO = RejectRestaurantRequestDTO.builder()
                .reason("Invalid details")
                .build();

        AdminRestaurantResponseDTO responseDTO = AdminRestaurantResponseDTO.builder()
                .id(1L)
                .name("Chay Quan")
                .status("REJECTED")
                .build();

        when(adminRestaurantService.rejectRestaurant(eq(1L), any(RejectRestaurantRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(put("/api/admin/restaurants/1/reject")
                        .content(objectMapper.writeValueAsString(requestDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("REJECTED"));
    }
}
