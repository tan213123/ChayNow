package com.teamg5.be.controller;

import com.teamg5.be.dto.ApiResponse;
import com.teamg5.be.dto.MediaResponse;
import com.teamg5.be.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload single image/video to Cloudinary and save to Media entity")
    public ResponseEntity<ApiResponse<MediaResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "restaurantId", required = false) Long restaurantId,
            @RequestParam(value = "reviewId", required = false) Long reviewId
    ) {
        MediaResponse data = mediaService.uploadFile(file, restaurantId, reviewId);
        ApiResponse<MediaResponse> response = ApiResponse.<MediaResponse>builder()
                .success(true)
                .message("File uploaded successfully!")
                .data(data)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(value = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload multiple images/videos to Cloudinary and save to Media entities")
    public ResponseEntity<ApiResponse<List<MediaResponse>>> uploadFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "restaurantId", required = false) Long restaurantId,
            @RequestParam(value = "reviewId", required = false) Long reviewId
    ) {
        List<MediaResponse> data = mediaService.uploadFiles(files, restaurantId, reviewId);
        ApiResponse<List<MediaResponse>> response = ApiResponse.<List<MediaResponse>>builder()
                .success(true)
                .message("Files uploaded successfully!")
                .data(data)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
