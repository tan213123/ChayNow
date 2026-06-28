import apiService from "./api.service";

export interface CreateReportRequest {
  targetType: "RESTAURANT" | "POST" | "REVIEW" | "COMMENT";
  targetId: number;
  reason: string;
  details?: string;
}

export const createReport = async (data: CreateReportRequest) => {
  const response = await apiService.post("/api/reports", data);
  return response;
};
