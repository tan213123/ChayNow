import apiService from "@/services/api.service";

export const login = async (data: { email: string; password: string }) => {
  return await apiService.post("/auth/login", data);
};
