package com.teamg5.be.service;

import com.teamg5.be.dto.PageResponseDTO;
import com.teamg5.be.dto.PostingResponse;
import com.teamg5.be.dto.RejectPostingRequestDTO;

public interface AdminPostingService {
    PageResponseDTO<PostingResponse> getAllPostings(String keyword, String status, int page, int size);
    PostingResponse approvePosting(Long postingId);
    PostingResponse rejectPosting(Long postingId, RejectPostingRequestDTO request);
}
