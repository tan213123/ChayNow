import { Search, Eye, Check, X, AlertTriangle, Calendar, Star, MapPin, Phone, Clock, DollarSign, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import {
  getAdminRestaurants,
  approveRestaurant,
  rejectRestaurant,
  type AdminRestaurant,
  type RestaurantStatus,
} from "@/services/admin.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const staticPlaces = [
  { id: 1, name: "Quận 1" },
  { id: 2, name: "Quận 3" },
  { id: 3, name: "Quận 5" },
  { id: 4, name: "Quận 10" },
  { id: 5, name: "Phú Nhuận" },
  { id: 6, name: "Bình Thạnh" },
  { id: 7, name: "Tân Bình" },
];

const statusTabs: { value: RestaurantStatus | "ALL"; label: string; countColor: string }[] = [
  { value: "PENDING", label: "Chờ duyệt", countColor: "bg-amber-100 text-amber-800" },
  { value: "APPROVED", label: "Đã duyệt", countColor: "bg-emerald-100 text-emerald-800" },
  { value: "REJECTED", label: "Từ chối", countColor: "bg-red-100 text-red-800" },
  { value: "ALL", label: "Tất cả", countColor: "bg-slate-100 text-slate-800" },
];

export default function AdminLocations() {
  const [restaurantsList, setRestaurantsList] = useState<AdminRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter states
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [placeFilter, setPlaceFilter] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<RestaurantStatus | "ALL">("PENDING");

  // Interaction modals
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeRestaurant, setActiveRestaurant] = useState<AdminRestaurant | null>(null);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Debounce search keyword
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminRestaurants({
        page,
        size,
        keyword: debouncedQuery,
        placeId: placeFilter,
        status: statusFilter,
      });

      setRestaurantsList(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err: any) {
      setError(err?.message || "Đã xảy ra lỗi khi tải danh sách địa điểm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [page, size, debouncedQuery, placeFilter, statusFilter]);

  const handleApprove = async () => {
    if (!activeRestaurant) return;
    setActionLoading(true);
    try {
      await approveRestaurant(activeRestaurant.id);
      toast.success(`Đã duyệt nhà hàng "${activeRestaurant.name}" thành công!`);
      setApproveOpen(false);
      setActiveRestaurant(null);
      fetchRestaurants();
    } catch (err: any) {
      toast.error(err?.message || "Không thể duyệt nhà hàng. Vui lòng thử lại.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!activeRestaurant) return;
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }
    setActionLoading(true);
    try {
      await rejectRestaurant(activeRestaurant.id, rejectReason.trim());
      toast.success(`Đã từ chối duyệt nhà hàng "${activeRestaurant.name}".`);
      setRejectOpen(false);
      setActiveRestaurant(null);
      setRejectReason("");
      fetchRestaurants();
    } catch (err: any) {
      toast.error(err?.message || "Không thể từ chối nhà hàng. Vui lòng thử lại.");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <AdminLayout title="Quản lý địa điểm">
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
            Quản lý địa điểm
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Duyệt và quản lý các địa điểm ăn chay trong hệ thống.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm địa điểm..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Place/District filter */}
            <div className="w-full md:w-64">
              <select
                value={placeFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setPlaceFilter(val === "ALL" ? "ALL" : Number(val));
                  setPage(0);
                }}
                className="h-12 w-full rounded-2xl border border-emerald-500 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:ring-4 focus:ring-emerald-100"
              >
                <option value="ALL">Tất cả khu vực</option>
                {staticPlaces.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status filter tabs */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
            {statusTabs.map((tab) => {
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => {
                    setStatusFilter(tab.value);
                    setPage(0);
                  }}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESTAURANTS LIST */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-lg text-slate-500">
            <span className="animate-pulse">Đang tải danh sách địa điểm...</span>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        ) : restaurantsList.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <p className="text-lg font-medium">Không tìm thấy địa điểm nào.</p>
            <p className="mt-1 text-sm text-slate-400">
              Thử thay đổi từ khóa hoặc bộ lọc trạng thái để tìm kiếm.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {restaurantsList.map((restaurant) => {
              const displayImage = restaurant.image || restaurant.avatarUrl || "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=400&q=80";
              const ratingVal = restaurant.rating || 5.0;
              const reviewsVal = restaurant.reviews !== undefined ? restaurant.reviews : (restaurant.reviewCount || 0);
              const displayLocation = restaurant.location || restaurant.address || "Chưa có địa chỉ";
              const displayTags = restaurant.tags && restaurant.tags.length > 0 ? restaurant.tags : ["Chay Á"];

              return (
                <article
                  key={restaurant.id}
                  className="flex flex-col sm:flex-row gap-5 p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Left Column - Image */}
                  <div className="w-full sm:w-28 h-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={displayImage}
                      alt={restaurant.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>

                  {/* Right Column - Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-extrabold text-lg text-slate-900 line-clamp-1">
                          {restaurant.name}
                        </h2>
                        {restaurant.category && (
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                            {restaurant.category}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 text-sm line-clamp-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        {displayLocation}
                      </p>

                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800">{ratingVal.toFixed(1)}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">{reviewsVal} đánh giá</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {displayTags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Created Date */}
                      <p className="text-slate-400 text-xs flex items-center gap-1 pt-1">
                        <Calendar className="h-3 w-3" />
                        Tạo: {formatDate(restaurant.createdDate || restaurant.createdAt)}
                      </p>
                    </div>

                    {/* Buttons row */}
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-4">
                      <button
                        onClick={() => {
                          setActiveRestaurant(restaurant);
                          setDetailOpen(true);
                        }}
                        className="flex items-center justify-center gap-1.5 flex-1 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition h-10"
                      >
                        <Eye className="h-4 w-4" />
                        Xem
                      </button>

                      {restaurant.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => {
                              setActiveRestaurant(restaurant);
                              setApproveOpen(true);
                            }}
                            className="flex items-center justify-center gap-1.5 flex-1 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition h-10"
                          >
                            <Check className="h-4 w-4" />
                            Duyệt
                          </button>

                          <button
                            onClick={() => {
                              setActiveRestaurant(restaurant);
                              setRejectOpen(true);
                            }}
                            className="flex items-center justify-center gap-1.5 flex-1 rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition h-10"
                          >
                            <X className="h-4 w-4" />
                            Từ chối
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-6">
            <p className="text-sm text-slate-500">
              Hiển thị trang <span className="font-semibold text-slate-900">{page + 1}</span> /{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span> ({totalElements} địa điểm)
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl px-4 py-2"
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl px-4 py-2"
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 text-slate-950 p-6 rounded-3xl shadow-xl max-h-[85vh] overflow-y-auto">
          {activeRestaurant && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold text-slate-950 flex items-center justify-between pr-4">
                  {activeRestaurant.name}
                  {activeRestaurant.category && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      {activeRestaurant.category}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Chi tiết thông tin địa điểm gửi lên hệ thống.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-5">
                {/* Cover image */}
                <div className="h-48 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={activeRestaurant.image || activeRestaurant.avatarUrl || "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=600&q=80"}
                    alt={activeRestaurant.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Details layout */}
                <div className="grid gap-4 sm:grid-cols-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Địa chỉ</p>
                      <p className="text-slate-600">{activeRestaurant.location || activeRestaurant.address || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Phone className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Số điện thoại</p>
                      <p className="text-slate-600">{activeRestaurant.phone || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Giờ hoạt động</p>
                      <p className="text-slate-600">{activeRestaurant.hours || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <DollarSign className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Mức giá</p>
                      <p className="text-slate-600">{activeRestaurant.priceRange || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Tags section */}
                {activeRestaurant.tags && activeRestaurant.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                      <Tag className="h-4 w-4 text-slate-400" />
                      Nhãn / Danh mục ăn chay
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeRestaurant.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Intro / Description */}
                {activeRestaurant.intro && (
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Mô tả quán</p>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {activeRestaurant.intro}
                    </p>
                  </div>
                )}

                {/* Reject Reason Alert (if Rejected) */}
                {activeRestaurant.status === "REJECTED" && activeRestaurant.rejectReason && (
                  <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 text-sm text-red-800">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Lý do từ chối duyệt:
                    </p>
                    <p className="mt-1 text-red-700 italic">
                      "{activeRestaurant.rejectReason}"
                    </p>
                  </div>
                )}

                {/* General status info */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <p>Trạng thái hiện tại: <span className="font-bold uppercase text-slate-600">{activeRestaurant.status}</span></p>
                  <p>Ngày tạo: {formatDate(activeRestaurant.createdDate || activeRestaurant.createdAt)}</p>
                </div>
              </div>

              <DialogFooter className="mt-6 flex flex-row justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => {
                    setDetailOpen(false);
                    setActiveRestaurant(null);
                  }}
                  className="rounded-xl px-5 py-2.5 font-bold bg-slate-900 text-white hover:bg-slate-800"
                >
                  Đóng
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* APPROVE CONFIRM DIALOG */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 text-slate-950 p-6 rounded-3xl shadow-xl">
          <DialogHeader>
            <DialogTitle>Duyệt địa điểm chay</DialogTitle>
            <DialogDescription className="text-slate-500">
              Bạn có chắc chắn muốn duyệt nhà hàng{" "}
              <strong className="text-slate-900">"{activeRestaurant?.name}"</strong>?
              Sau khi được duyệt, địa điểm sẽ hiển thị công khai trên ứng dụng.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setApproveOpen(false);
                setActiveRestaurant(null);
              }}
              disabled={actionLoading}
              className="rounded-xl px-4 py-2"
            >
              Hủy
            </Button>

            <Button
              type="button"
              onClick={handleApprove}
              disabled={actionLoading}
              className="rounded-xl px-4 py-2 font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {actionLoading ? "Đang xử lý..." : "Xác nhận duyệt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT DIALOG */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 text-slate-950 p-6 rounded-3xl shadow-xl">
          <DialogHeader>
            <DialogTitle>Từ chối duyệt địa điểm</DialogTitle>
            <DialogDescription className="text-slate-500">
              Vui lòng nhập lý do từ chối duyệt nhà hàng{" "}
              <strong className="text-slate-900">"{activeRestaurant?.name}"</strong>.
              Lý do này sẽ được gửi tới chủ quán để họ sửa đổi thông tin.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Lý do từ chối *
            </label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do chi tiết..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
              required
            />
          </div>

          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRejectOpen(false);
                setRejectReason("");
                setActiveRestaurant(null);
              }}
              disabled={actionLoading}
              className="rounded-xl px-4 py-2"
            >
              Hủy
            </Button>

            <Button
              type="button"
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
              className="rounded-xl px-4 py-2 font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? "Đang xử lý..." : "Từ chối duyệt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
