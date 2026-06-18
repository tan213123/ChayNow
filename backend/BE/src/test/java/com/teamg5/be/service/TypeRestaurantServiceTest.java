package com.teamg5.be.service;

import com.teamg5.be.dto.CreateTypeRestaurantRequest;
import com.teamg5.be.dto.TypeRestaurantResponse;
import com.teamg5.be.entity.TypeRestaurant;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.TypeRestaurantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TypeRestaurantServiceTest {

    @InjectMocks
    private TypeRestaurantService typeRestaurantService;

    @Mock
    private TypeRestaurantRepository typeRestaurantRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void createdTypeRestaurant_Success() {
        // Arrange
        CreateTypeRestaurantRequest request = new CreateTypeRestaurantRequest();
        request.setName("Buffet Chay");
        request.setDescription("All you can eat vegan");

        TypeRestaurant savedType = TypeRestaurant.builder()
                .name("Buffet Chay")
                .description("All you can eat vegan")
                .build();
        savedType.setId(1L);

        when(typeRestaurantRepository.existsByName("Buffet Chay")).thenReturn(false);
        when(typeRestaurantRepository.save(any(TypeRestaurant.class))).thenReturn(savedType);

        // Act
        TypeRestaurantResponse response = typeRestaurantService.createdTypeRestaurant(request);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Buffet Chay", response.getName());
        verify(typeRestaurantRepository, times(1)).save(any(TypeRestaurant.class));
    }

    @Test
    public void createdTypeRestaurant_AlreadyExists_ThrowsException() {
        // Arrange
        CreateTypeRestaurantRequest request = new CreateTypeRestaurantRequest();
        request.setName("Buffet Chay");

        when(typeRestaurantRepository.existsByName("Buffet Chay")).thenReturn(true);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> typeRestaurantService.createdTypeRestaurant(request));
        assertEquals(ErrorCode.TYPE_RESTAURANT_ALREADY_EXISTS, exception.getErrorCode());
        verify(typeRestaurantRepository, never()).save(any(TypeRestaurant.class));
    }

    @Test
    public void getAllTypeRestaurant_Success() {
        // Arrange
        TypeRestaurant type = TypeRestaurant.builder()
                .name("Buffet Chay")
                .build();
        type.setId(1L);

        when(typeRestaurantRepository.findAll()).thenReturn(Collections.singletonList(type));

        // Act
        List<TypeRestaurantResponse> responses = typeRestaurantService.getAllTypeRestaurant();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Buffet Chay", responses.get(0).getName());
    }

    @Test
    public void getTypeRestaurantById_Found_Success() {
        // Arrange
        TypeRestaurant type = TypeRestaurant.builder()
                .name("Buffet Chay")
                .build();
        type.setId(1L);

        when(typeRestaurantRepository.findById(1L)).thenReturn(Optional.of(type));

        // Act
        TypeRestaurantResponse response = typeRestaurantService.getTypeRestaurantById(1L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Buffet Chay", response.getName());
    }

    @Test
    public void getTypeRestaurantById_NotFound_ThrowsException() {
        // Arrange
        when(typeRestaurantRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> typeRestaurantService.getTypeRestaurantById(1L));
        assertEquals(ErrorCode.TYPE_RESTAURANT_NOT_FOUND, exception.getErrorCode());
    }
}
