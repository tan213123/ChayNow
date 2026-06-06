package com.teamg5.be.modules.retaurants.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import com.teamg5.be.modules.retaurants.entity.Media;

@Getter
@Setter
@Builder
public class MediaResponse {
    
    private Long id;
    private String url;
    private String type;

    public static MediaResponse from(Media media) {
        return MediaResponse.builder()
                .id(media.getId())
                .url(media.getUrl())
                .type(media.getType().name())
                .build();
    }
}
