package com.teamg5.be.dto;

import com.teamg5.be.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private Long postingId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long authorId;
    private String authorName;
    private String authorAvatarUrl;

    public static CommentResponse from(Comment comment) {
        if (comment == null) return null;
        return CommentResponse.builder()
                .id(comment.getId())
                .postingId(comment.getPosting() != null ? comment.getPosting().getId() : null)
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .authorId(comment.getUser() != null ? comment.getUser().getId() : null)
                .authorName(comment.getUser() != null ? comment.getUser().getFullName() : null)
                .authorAvatarUrl(comment.getUser() != null ? comment.getUser().getAvatarUrl() : null)
                .build();
    }
}
