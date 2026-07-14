import apiService from "@/services/api.service";

export interface CommentResponse {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatarUrl?: string;
  postingId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PageResponseDTO<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const createComment = async (
  postingId: number,
  content: string
): Promise<CommentResponse> => {
  const response = await apiService.post<{ data: CommentResponse }>(
    `/api/postings/${postingId}/comments`,
    { content }
  );
  return response.data?.data || (response as any).data || response;
};

export const getComments = async (
  postingId: number,
  page: number = 0,
  size: number = 10
): Promise<PageResponseDTO<CommentResponse>> => {
  const response = await apiService.get<{ data: PageResponseDTO<CommentResponse> }>(
    `/api/postings/${postingId}/comments`,
    {
      params: { page, size },
    }
  );
  return response.data?.data || (response as any).data || response;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await apiService.delete(`/api/comments/${commentId}`);
};
