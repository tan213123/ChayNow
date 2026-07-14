import apiService from "@/services/api.service";

type MaybeWrapped<T> = T | { success?: boolean; data: T };

const unwrapResponse = <T>(response: MaybeWrapped<T>): T => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    return response.data;
  }

  return response as T;
};

export interface AdminDashboardStats {
  totalUsers: number;
  totalOwners: number;
  totalAdmins: number;
  totalRestaurants: number;
  pendingRestaurants: number;
  approvedRestaurants: number;
  rejectedRestaurants: number;
  totalReviews: number;
  totalPostings: number;
  pendingReports: number;
  resolvedReports: number;
  rejectedReports: number;
}

export const getAdminDashboardStats =
  async (): Promise<AdminDashboardStats> => {
    const response = await apiService.get<
      MaybeWrapped<AdminDashboardStats>,
      MaybeWrapped<AdminDashboardStats>
    >("/api/admin/dashboard/stats");

    const data = unwrapResponse(response);

    return {
      totalUsers: data?.totalUsers ?? 0,
      totalOwners: data?.totalOwners ?? 0,
      totalAdmins: data?.totalAdmins ?? 0,
      totalRestaurants: data?.totalRestaurants ?? 0,
      pendingRestaurants: data?.pendingRestaurants ?? 0,
      approvedRestaurants: data?.approvedRestaurants ?? 0,
      rejectedRestaurants: data?.rejectedRestaurants ?? 0,
      totalReviews: data?.totalReviews ?? 0,
      totalPostings: data?.totalPostings ?? 0,
      pendingReports: data?.pendingReports ?? 0,
      resolvedReports: data?.resolvedReports ?? 0,
      rejectedReports: data?.rejectedReports ?? 0,
    };
  };
