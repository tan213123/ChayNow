package com.teamg5.be.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.teamg5.be.dto.MediaResponse;
import com.teamg5.be.entity.Media;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.MediaRepository;
import com.teamg5.be.repository.RestaurantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import com.teamg5.be.service.impl.MediaServiceImpl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class MediaServiceTest {

    @InjectMocks
    private MediaServiceImpl mediaService;

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @Mock
    private MediaRepository mediaRepository;

    @Mock
    private RestaurantRepository restaurantRepository;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        when(cloudinary.uploader()).thenReturn(uploader);
    }

    @Test
    public void uploadFile_ValidFileWithoutRestaurant_Success() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "image-content".getBytes()
        );

        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("secure_url", "http://cloudinary.com/test.jpg");

        when(uploader.upload(any(byte[].class), any(Map.class))).thenReturn(uploadResult);

        when(mediaRepository.save(any(Media.class))).thenAnswer(invocation -> {
            Media media = invocation.getArgument(0);
            media.setId(1L);
            return media;
        });

        // Act
        MediaResponse response = mediaService.uploadFile(file, null);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("http://cloudinary.com/test.jpg", response.getUrl());
        assertEquals("IMAGE", response.getType());
        verify(mediaRepository, times(1)).save(any(Media.class));
    }

    @Test
    public void uploadFile_ValidFileWithRestaurant_Success() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "image-content".getBytes()
        );

        Restaurant restaurant = Restaurant.builder().name("Test Restaurant").build();
        restaurant.setId(10L);

        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("secure_url", "http://cloudinary.com/test.jpg");

        when(uploader.upload(any(byte[].class), any(Map.class))).thenReturn(uploadResult);
        when(restaurantRepository.findById(10L)).thenReturn(Optional.of(restaurant));

        when(mediaRepository.save(any(Media.class))).thenAnswer(invocation -> {
            Media media = invocation.getArgument(0);
            media.setId(1L);
            return media;
        });

        // Act
        MediaResponse response = mediaService.uploadFile(file, 10L);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("http://cloudinary.com/test.jpg", response.getUrl());
        verify(restaurantRepository, times(1)).findById(10L);
        verify(mediaRepository, times(1)).save(any(Media.class));
    }

    @Test
    public void uploadFile_EmptyFile_ThrowsException() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", "", "image/jpeg", new byte[0]
        );

        // Act & Assert
        AppException exception = assertThrows(
                AppException.class,
                () -> mediaService.uploadFile(file, null)
        );
        assertEquals(ErrorCode.EMPTY_FILE, exception.getErrorCode());
        verifyNoInteractions(uploader);
    }

    @Test
    public void uploadFile_RestaurantNotFound_ThrowsException() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "image-content".getBytes()
        );

        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("secure_url", "http://cloudinary.com/test.jpg");

        when(uploader.upload(any(byte[].class), any(Map.class))).thenReturn(uploadResult);
        when(restaurantRepository.findById(10L)).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(
                AppException.class,
                () -> mediaService.uploadFile(file, 10L)
        );
        assertEquals(ErrorCode.RESTAURANT_NOT_FOUND, exception.getErrorCode());
        verify(mediaRepository, never()).save(any(Media.class));
    }

    @Test
    public void uploadFiles_MultipleFiles_Success() throws IOException {
        // Arrange
        MockMultipartFile file1 = new MockMultipartFile(
                "files", "test1.jpg", "image/jpeg", "image-content-1".getBytes()
        );
        MockMultipartFile file2 = new MockMultipartFile(
                "files", "test2.jpg", "image/jpeg", "image-content-2".getBytes()
        );

        Map<String, Object> uploadResult1 = new HashMap<>();
        uploadResult1.put("secure_url", "http://cloudinary.com/test1.jpg");

        Map<String, Object> uploadResult2 = new HashMap<>();
        uploadResult2.put("secure_url", "http://cloudinary.com/test2.jpg");

        when(uploader.upload(any(byte[].class), any(Map.class)))
                .thenReturn(uploadResult1)
                .thenReturn(uploadResult2);

        when(mediaRepository.save(any(Media.class))).thenAnswer(invocation -> {
            Media media = invocation.getArgument(0);
            media.setId(1L);
            return media;
        });

        // Act
        List<MediaResponse> responses = mediaService.uploadFiles(new MockMultipartFile[]{file1, file2}, null);

        // Assert
        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertEquals("http://cloudinary.com/test1.jpg", responses.get(0).getUrl());
        assertEquals("http://cloudinary.com/test2.jpg", responses.get(1).getUrl());
        verify(mediaRepository, times(2)).save(any(Media.class));
    }
}
