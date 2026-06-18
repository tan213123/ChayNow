import { Search, Check, X, Calendar, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import {
  getAdminPostings,
  approvePosting,
  rejectPosting,
  type AdminPosting,
  type PostingStatus,
} from "@/services/adminPosting.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const staticCategories = [
  "Món chính",
  "Ăn vặt / Khai vị",
  "Tráng miệng",
  "Đồ uống",
  "Bún",
  "Phở",
  "Cơm",
  "Mì",
];

const statusTabs: { value: PostingStatus | "ALL"; label: string }[] = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "ALL", label: "Tất cả" },
];

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export default function AdminPosts() {
  const [postsList, setPostsList] = useState<AdminPosting[]>([]);
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
  const [categoryFilter, setCategoryFilter] = useState<string | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<PostingStatus | "ALL">("PENDING");

  // Interaction modals
  const [activePost, setActivePost] = useState<AdminPosting | null>(null);
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

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminPostings({
        page,
        size,
        keyword: debouncedQuery,
        status: statusFilter,
      });

      setPostsList(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err, "Đã xảy ra lỗi khi tải danh sách bài đăng."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, size, debouncedQuery, categoryFilter, statusFilter]);

  const handleApprove = async () => {
    if (!activePost) return;
    setActionLoading(true);
    try {
      await approvePosting(activePost.id);
      toast.success(`Đã duyệt bài đăng món ăn "${activePost.name}" thành công!`);
      setApproveOpen(false);
      setActivePost(null);
      fetchPosts();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể duyệt bài đăng. Vui lòng thử lại."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!activePost) return;
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }
    setActionLoading(true);
    try {
      await rejectPosting(activePost.id, rejectReason.trim());
      toast.success(`Đã từ chối duyệt bài đăng món ăn "${activePost.name}".`);
      setRejectOpen(false);
      setActivePost(null);
      setRejectReason("");
      fetchPosts();
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể từ chối bài đăng. Vui lòng thử lại."));
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
    <AdminLayout title="Quản lý bài đăng">
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
            Quản lý bài đăng
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Duyệt và quản lý các bài đăng món ăn từ chủ quán gửi lên hệ thống.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm món ăn hoặc nhà hàng..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Category Select Filter */}
            <div className="w-full md:w-64">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(0);
                }}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="ALL">Tất cả loại món</option>
                {staticCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status tabs filter */}
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

        {/* POSTS LISTING */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-lg text-slate-500">
            <span className="animate-pulse">Đang tải danh sách bài đăng...</span>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        ) : postsList.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <p className="text-lg font-medium">Không tìm thấy bài đăng món ăn nào.</p>
            <p className="mt-1 text-sm text-slate-400">
              Hãy kiểm tra các từ khóa tìm kiếm hoặc đổi trạng thái duyệt.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {postsList.map((post) => {
              const displayImage = post.image || post.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80";
              const displayType = post.type || "Món chay";

              return (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Image Container (WITHOUT likes count) */}
                  <div className="relative h-56 overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={displayImage}
                      alt={post.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      {/* Meta Category and Date */}
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
                          {displayType}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.createdDate || post.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-extrabold text-xl text-slate-900 line-clamp-1">
                        {post.name}
                      </h2>

                      {/* Restaurant */}
                      {post.restaurantName && (
                        <p className="text-slate-500 text-sm flex items-center gap-1">
                          <Store className="h-4 w-4 shrink-0 text-slate-400" />
                          {post.restaurantName}
                        </p>
                      )}

                      {/* Description */}
                      {post.description && (
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      )}

                      {/* Reject reason alert if rejected */}
                      {post.status === "REJECTED" && post.rejectReason && (
                        <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs text-red-700 italic">
                          <span className="font-bold block text-[10px] uppercase tracking-wider text-red-500 not-italic">Lý do từ chối:</span>
                          "{post.rejectReason}"
                        </div>
                      )}
                    </div>

                    {/* Actions row (Approve/Reject buttons only for PENDING) */}
                    {post.status === "PENDING" && (
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-2">
                        <button
                          onClick={() => {
                            setActivePost(post);
                            setApproveOpen(true);
                          }}
                          className="flex items-center justify-center gap-1.5 flex-1 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition h-10"
                        >
                          <Check className="h-4 w-4" />
                          Duyệt
                        </button>

                        <button
                          onClick={() => {
                            setActivePost(post);
                            setRejectOpen(true);
                          }}
                          className="flex items-center justify-center gap-1.5 flex-1 rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition h-10"
                        >
                          <X className="h-4 w-4" />
                          Từ chối
                        </button>
                      </div>
                    )}
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
              <span className="font-semibold text-slate-900">{totalPages}</span> ({totalElements} bài đăng)
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

      {/* APPROVE CONFIRM DIALOG */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200 text-slate-950 p-6 rounded-3xl shadow-xl">
          <DialogHeader>
            <DialogTitle>Duyệt bài đăng món ăn</DialogTitle>
            <DialogDescription className="text-slate-500">
              Bạn có chắc chắn muốn duyệt bài đăng món chay{" "}
              <strong className="text-slate-900">"{activePost?.name}"</strong>?
              Sau khi được duyệt, món ăn này sẽ được thêm vào thực đơn của quán và hiển thị công khai trên ứng dụng.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setApproveOpen(false);
                setActivePost(null);
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
            <DialogTitle>Từ chối duyệt bài đăng</DialogTitle>
            <DialogDescription className="text-slate-500">
              Vui lòng nhập lý do từ chối duyệt bài đăng món ăn{" "}
              <strong className="text-slate-900">"{activePost?.name}"</strong>.
              Lý do này sẽ được gửi tới chủ quán để họ cập nhật chỉnh sửa lại.
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
                setActivePost(null);
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
