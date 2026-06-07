package com.teamg5.be.controller;

import com.teamg5.be.dto.AdminUserResponseDTO;
import com.teamg5.be.dto.PageResponse;
import com.teamg5.be.service.AdminUserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import com.teamg5.be.security.JwtService;
import org.springframework.security.core.userdetails.UserDetailsService;
import com.teamg5.be.security.JwtAuthenticationEntryPoint;
import com.teamg5.be.security.JwtAccessDeniedHandler;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false) // Bypass security filters for admin API testing
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminUserService adminUserService;

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
    public void getAllUsers_Success() throws Exception {
        AdminUserResponseDTO dto = AdminUserResponseDTO.builder()
                .id(1L)
                .fullName("Test Admin")
                .email("admin@test.com")
                .role("ADMIN")
                .status("ACTIVE")
                .build();

        PageResponse<AdminUserResponseDTO> pageResponse = PageResponse.<AdminUserResponseDTO>builder()
                .content(Collections.singletonList(dto))
                .page(0)
                .size(1)
                .totalElements(1L)
                .totalPages(1)
                .last(true)
                .build();

        when(adminUserService.getAllUsers(anyInt(), anyInt(), anyString(), anyString(), anyString()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/admin/users")
                        .param("page", "0")
                        .param("size", "6")
                        .param("keyword", "Test")
                        .param("role", "ADMIN")
                        .param("status", "ACTIVE")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].fullName").value("Test Admin"))
                .andExpect(jsonPath("$.content[0].email").value("admin@test.com"));
    }

    @Test
    public void suspendUser_Success() throws Exception {
        doNothing().when(adminUserService).suspendUser(2L);

        mockMvc.perform(put("/api/admin/users/2/suspend")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User suspended successfully"));

        verify(adminUserService, times(1)).suspendUser(2L);
    }

    @Test
    public void activateUser_Success() throws Exception {
        doNothing().when(adminUserService).activateUser(2L);

        mockMvc.perform(put("/api/admin/users/2/activate")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User activated successfully"));

        verify(adminUserService, times(1)).activateUser(2L);
    }
}
