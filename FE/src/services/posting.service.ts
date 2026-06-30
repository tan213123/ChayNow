import apiService from "@/services/api.service";

export interface PostingResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  thumbnailUrl: string;
  likeCount: number;
  commentCount: number;
  status: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string;
  restaurantId?: number;
  restaurantName?: string;
  restaurantAddress?: string;
}

export interface PageResponseDTO<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface CreatePostingRequest {
  title: string;
  content: string;
  category?: string;
  imageUrl?: string;
}

export const createPosting = async (
  data: CreatePostingRequest
): Promise<PostingResponse> => {
  const response = await apiService.post<{ data: PostingResponse }>(
    `/api/postings`,
    data
  );
  return response.data?.data || (response as any).data || response;
};

export const getPublicPostings = async (
  params?: {
    keyword?: string;
    categoryId?: string;
    restaurantId?: number;
    placeId?: number;
    page?: number;
    size?: number;
  }
): Promise<PageResponseDTO<PostingResponse>> => {
  const response = await apiService.get<{ data: PageResponseDTO<PostingResponse> }>(
    `/api/postings`,
    { params }
  );
  return response.data?.data || (response as any).data || response;
};

export const getPublicPostingDetail = async (
  postingId: number
): Promise<PostingResponse> => {
  const response = await apiService.get<{ data: PostingResponse }>(
    `/api/postings/${postingId}`
  );
  return response.data?.data || (response as any).data || response;
};
