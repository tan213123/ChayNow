package com.teamg5.be.dto;

import lombok.Data;

@Data
public class AdminFoodPostListRequest {
    private Integer page = 0;
    private Integer size = 10;
    private String keyword;
    private String categoryId;
    private String status;
    private Integer minLikes;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
