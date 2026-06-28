const restaurantStatusMeta = {
  PENDING: {
    label: "Chờ duyệt",
    description: "Quán đang chờ admin duyệt trước khi hiển thị công khai.",
    className: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  APPROVED: {
    label: "Đã duyệt",
    description: "Quán đã được admin duyệt.",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  REJECTED: {
    label: "Từ chối",
    description: "Quán chưa được duyệt. Vui lòng xem lý do và chỉnh sửa lại.",
    className: "bg-rose-50 text-rose-700 ring-rose-100",
  },
} as const;

type RestaurantStatusKey = keyof typeof restaurantStatusMeta;

const isRestaurantStatusKey = (status: string): status is RestaurantStatusKey =>
  status in restaurantStatusMeta;

export const getRestaurantStatusMeta = (status?: string | null) => {
  if (status && isRestaurantStatusKey(status)) {
    return restaurantStatusMeta[status];
  }

  return {
    label: "Chưa cập nhật",
    description: "Chưa có thông tin duyệt từ admin.",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  };
};
