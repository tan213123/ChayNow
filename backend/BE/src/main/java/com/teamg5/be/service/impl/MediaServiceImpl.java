package com.teamg5.be.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.teamg5.be.dto.MediaResponse;
import com.teamg5.be.entity.Media;
import com.teamg5.be.entity.Mediatype;
import com.teamg5.be.entity.Restaurant;
import com.teamg5.be.entity.Review;
import com.teamg5.be.exception.AppException;
import com.teamg5.be.exception.ErrorCode;
import com.teamg5.be.repository.MediaRepository;
import com.teamg5.be.repository.RestaurantRepository;
import com.teamg5.be.repository.ReviewRepository;
import com.teamg5.be.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final Cloudinary cloudinary;
    private final MediaRepository mediaRepository;
    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;

    /**
     * Upload a single file to Cloudinary and save to Media entity.
     */
    @Override
    @Transactional
    public MediaResponse uploadFile(MultipartFile file, Long restaurantId) {
        return uploadFile(file, restaurantId, null);
    }

    /**
     * Upload a single file to Cloudinary and save to Media entity.
     */
    @Override
    @Transactional
    public MediaResponse uploadFile(MultipartFile file, Long restaurantId, Long reviewId) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.EMPTY_FILE);
        }

        try {
            // Upload to Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("resource_type", "auto")
            );
            String url = (String) uploadResult.get("secure_url");

            Restaurant restaurant = null;
            if (restaurantId != null) {
                restaurant = restaurantRepository.findById(restaurantId)
                        .orElseThrow(() -> new AppException(ErrorCode.RESTAURANT_NOT_FOUND));
            }

            Review review = null;
            if (reviewId != null) {
                review = reviewRepository.findById(reviewId)
                        .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_FOUND));
            }

            // Determine Media type (IMAGE / VIDEO)
            Mediatype mediatype = Mediatype.IMAGE;
            String contentType = file.getContentType();
            if (contentType != null && contentType.startsWith("video")) {
                mediatype = Mediatype.VIDEO;
            }

            Media media = Media.builder()
                    .url(url)
                    .type(mediatype)
                    .restaurant(restaurant)
                    .review(review)
                    .build();

            Media savedMedia = mediaRepository.save(media);
            return MediaResponse.from(savedMedia);

        } catch (IOException e) {
            throw new AppException(ErrorCode.UPLOAD_FAILED, "Tải tập tin lên Cloudinary thất bại: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public List<MediaResponse> uploadFiles(MultipartFile[] files, Long restaurantId) {
        return uploadFiles(files, restaurantId, null);
    }

    /**
     * Upload multiple files to Cloudinary and save to Media entities.
     */
    @Override
    @Transactional
    public List<MediaResponse> uploadFiles(MultipartFile[] files, Long restaurantId, Long reviewId) {
        if (files == null || files.length == 0) {
            throw new AppException(ErrorCode.EMPTY_FILE, "Không có tập tin nào được tải lên");
        }

        List<MediaResponse> responses = new ArrayList<>();
        for (MultipartFile file : files) {
            responses.add(uploadFile(file, restaurantId, reviewId));
        }
        return responses;
    }
}
