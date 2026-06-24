package com.teamg5.be.service;

import com.teamg5.be.dto.CreateRestaurantRequest;
import com.teamg5.be.dto.RestaurantResponse;
import com.teamg5.be.entity.Media;
import com.teamg5.be.entity.Mediatype;
import com.teamg5.be.entity.Place;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.TypeRestaurant;
import com.teamg5.be.entity.User;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.MediaRepository;
import com.teamg5.be.repository.PlaceRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.TypeRestaurantRepository;
import com.teamg5.be.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class RestaurantServiceTest {

    @InjectMocks
    private RestaurantService restaurantService;

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private TypeRestaurantRepository typeRestaurantRepository;

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MediaRepository mediaRepository;

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
                .email("test@chaynow.com")
                .fullName("Test User")
                .build();
        currentUser.setId(1L);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn(currentUser);
    }

    @AfterEach
    public void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void createdRestaurant_ValidRequest_Success() {
        // Arrange
        CreateRestaurantRequest request = new CreateRestaurantRequest();
        request.setName("Vegan Paradise");
        request.setAddress("123 Green St");
        request.setPhoneNumber("0987654321");
        request.setDescription("Good food");
        request.setTypeRestaurantId(1L);
        request.setPlaceId(2L);
        request.setOpenTime(LocalTime.of(8, 0));
        request.setClosedTime(LocalTime.of(22, 0));

        TypeRestaurant type = TypeRestaurant.builder()
                .name("Vegan")
                .description("Pure vegan")
                .build();
        type.setId(1L);

        Place place = Place.builder()
                .name("District 1")
                .active(true)
                .build();
        place.setId(2L);

        Restaurant savedRestaurant = Restaurant.builder()
                .name("Vegan Paradise")
                .address("123 Green St")
                .phoneNumber("0987654321")
                .description("Good food")
                .typeRestaurant(type)
                .place(place)
                .openTime(LocalTime.of(8, 0))
                .closedTime(LocalTime.of(22, 0))
                .owner(currentUser)
                .mediaList(new ArrayList<>())
                .build();
        savedRestaurant.setId(10L);

        when(typeRestaurantRepository.findById(1L)).thenReturn(Optional.of(type));
        when(placeRepository.findByIdAndActiveTrue(2L)).thenReturn(Optional.of(place));
        when(restaurantRepository.save(any(Restaurant.class))).thenReturn(savedRestaurant);

        // Act
        RestaurantResponse response = restaurantService.createdRestaurant(request);

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Vegan Paradise", response.getName());
        assertEquals(0, response.getMediaList().size());
        verify(restaurantRepository, times(1)).save(any(Restaurant.class));
    }

    @Test
    public void createdRestaurant_TypeNotFound_ThrowsException() {
        // Arrange
        CreateRestaurantRequest request = new CreateRestaurantRequest();
        request.setTypeRestaurantId(1L);
        request.setPlaceId(2L);

        Place place = Place.builder()
                .name("District 1")
                .active(true)
                .build();
        place.setId(2L);

        when(placeRepository.findByIdAndActiveTrue(2L)).thenReturn(Optional.of(place));
        when(typeRestaurantRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> restaurantService.createdRestaurant(request));
        assertEquals(ErrorCode.TYPE_RESTAURANT_NOT_FOUND, exception.getErrorCode());
        verify(restaurantRepository, never()).save(any(Restaurant.class));
    }

    @Test
    public void getRestaurantById_Found_Success() {
        // Arrange
        TypeRestaurant type = TypeRestaurant.builder()
                .name("Vegan")
                .description("Pure vegan")
                .build();
        Restaurant restaurant = Restaurant.builder()
                .name("Vegan Paradise")
                .typeRestaurant(type)
                .build();
        restaurant.setId(10L);

        when(restaurantRepository.findByIdAndActiveTrue(10L)).thenReturn(Optional.of(restaurant));

        // Act
        RestaurantResponse response = restaurantService.getRestaurantById(10L);

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Vegan Paradise", response.getName());
    }

    @Test
    public void getRestaurantById_NotFound_ThrowsException() {
        // Arrange
        when(restaurantRepository.findByIdAndActiveTrue(10L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> restaurantService.getRestaurantById(10L));
        assertEquals(ErrorCode.RESTAURANT_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    public void getAllRestaurant_Success() {
        // Arrange
        TypeRestaurant type = TypeRestaurant.builder()
                .name("Vegan")
                .description("Pure vegan")
                .build();
        Restaurant restaurant = Restaurant.builder()
                .name("Vegan Paradise")
                .typeRestaurant(type)
                .build();
        restaurant.setId(10L);

        when(restaurantRepository.findAllByActiveTrue()).thenReturn(Collections.singletonList(restaurant));

        // Act
        List<RestaurantResponse> responses = restaurantService.getAllRestaurant();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Vegan Paradise", responses.get(0).getName());
    }
}
