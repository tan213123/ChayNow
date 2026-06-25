import {
  Calendar,
  Check,
  Heart,
  MessageCircle,
  Search,
  Store,
  Tag,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/services/api.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  approveFoodPost,
  getAdminFoodPosts,
  rejectFoodPost,
  type AdminFoodPost,
  type FoodPostStatus,
} from "@/services/adminFoodPost.service";
import {
  approvePosting,
  getAdminPostings,
  rejectPosting,
  type AdminPosting,
  type PostingStatus,
} from "@/services/adminPosting.service";

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

const ownerStatusTabs: { value: PostingStatus | "ALL"; label: string }[] = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "ALL", label: "Tất cả" },
];

const foodStatusTabs: { value: FoodPostStatus | "ALL"; label: string }[] = [
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "ALL", label: "Tất cả" },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

type AdminPostTab = "OWNER" | "FOOD";
type FoodAction = "APPROVE" | "REJECT";

export default function AdminPosts() {
  const [activeTab, setActiveTab] = useState<AdminPostTab>("OWNER");

  const [postsList, setPostsList] = useState<AdminPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [last, setLast] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<PostingStatus | "ALL">(
    "PENDING",
  );
  const [activePost, setActivePost] = useState<AdminPosting | null>(null);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [foodPosts, setFoodPosts] = useState<AdminFoodPost[]>([]);
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodError, setFoodError] = useState<string | null>(null);
  const [foodPage, setFoodPage] = useState(0);
  const [foodSize] = useState(10);
  const [foodTotalPages, setFoodTotalPages] = useState(0);
  const [foodTotalElements, setFoodTotalElements] = useState<number | null>(
    null,
  );
  const [foodQuery, setFoodQuery] = useState("");
  const [debouncedFoodQuery, setDebouncedFoodQuery] = useState("");
  const [foodStatusFilter, setFoodStatusFilter] = useState<
    FoodPostStatus | "ALL"
  >("PENDING");
  const [activeFoodPost, setActiveFoodPost] = useState<AdminFoodPost | null>(
    null,
  );
  const [foodAction, setFoodAction] = useState<FoodAction | null>(null);
  const [foodRejectReason, setFoodRejectReason] = useState("");
  const [foodActionLoadingId, setFoodActionLoadingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFoodQuery(foodQuery);
      setFoodPage(0);
    }, 500);

    return () => clearTimeout(handler);
  }, [foodQuery]);

  const fetchPosts = useCallback(async () => {
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
      setPage(data.page ?? page);
      setSize(data.size ?? size);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setLast(data.last ?? true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Không thể tải bài đăng của chủ quán."));
    } finally {
      setLoading(false);
    }
  }, [page, size, debouncedQuery, statusFilter]);

  const fetchFoodPosts = useCallback(async () => {
    setFoodLoading(true);
    setFoodError(null);
    try {
      const data = await getAdminFoodPosts({
        page: foodPage,
        size: foodSize,
        keyword: debouncedFoodQuery,
        status: foodStatusFilter,
      });

      setFoodPosts(data.data || []);
      setFoodTotalElements(data.pagination?.totalItems ?? null);
      setFoodTotalPages(data.pagination?.totalPages ?? 0);
    } catch (err) {
      setFoodError(getApiErrorMessage(err, "Không thể tải bài chia sẻ món ăn."));
    } finally {
      setFoodLoading(false);
    }
  }, [foodPage, foodSize, debouncedFoodQuery, foodStatusFilter]);

  useEffect(() => {
    void Promise.resolve().then(fetchPosts);
  }, [fetchPosts, categoryFilter]);

  useEffect(() => {
    if (activeTab !== "FOOD") return;
    void Promise.resolve().then(fetchFoodPosts);
  }, [activeTab, fetchFoodPosts]);

  const handleApprove = async () => {
    if (!activePost) return;
    setActionLoading(true);
    try {
      await approvePosting(activePost.id);
      toast.success(`Đã duyệt bài đăng "${activePost.title}".`);
      setApproveOpen(false);
      setActivePost(null);
      fetchPosts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể duyệt bài đăng."));
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
      toast.success(`Đã từ chối bài đăng "${activePost.title}".`);
      setRejectOpen(false);
      setActivePost(null);
      setRejectReason("");
      fetchPosts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể từ chối bài đăng."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleFoodAction = async () => {
    if (!activeFoodPost || !foodAction) return;
    if (foodAction === "REJECT" && !foodRejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }

    setFoodActionLoadingId(activeFoodPost.id);
    try {
      if (foodAction === "APPROVE") {
        await approveFoodPost(activeFoodPost.id);
        toast.success(`Đã duyệt bài chia sẻ "${activeFoodPost.title}".`);
      } else {
        await rejectFoodPost(activeFoodPost.id, foodRejectReason.trim());
        toast.success(`Đã từ chối bài chia sẻ "${activeFoodPost.title}".`);
      }

      setActiveFoodPost(null);
      setFoodAction(null);
      setFoodRejectReason("");
      await fetchFoodPosts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Không thể cập nhật bài chia sẻ."));
    } finally {
      setFoodActionLoadingId(null);
    }
  };

  const hasFoodNextPage =
    foodTotalPages > 0
      ? foodPage < foodTotalPages - 1
      : foodPosts.length >= foodSize;

  return (
    <AdminLayout title="Quản lý bài đăng">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
            Quản lý bài đăng
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200">
          {[
            { value: "OWNER" as const, label: "Bài đăng chủ quán" },
            { value: "FOOD" as const, label: "Bài chia sẻ món ăn" },
          ].map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`border-b-2 px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "OWNER" ? (
          <>
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm món ăn hoặc nhà hàng..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="w-full md:w-64">
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPage(0);
                    }}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  >
                    <option value="ALL">Tất cả danh mục</option>
                    {staticCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                {ownerStatusTabs.map((tab) => {
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

            {loading ? (
              <div className="flex h-64 items-center justify-center text-lg text-slate-500">
                <span className="animate-pulse">
                  Đang tải bài đăng chủ quán...
                </span>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                {error}
              </div>
            ) : postsList.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                <p className="text-lg font-medium">
                  Không tìm thấy bài đăng chủ quán.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {postsList.map((post) => {
                  const displayImage =
                    post.thumbnailUrl ||
                    post.restaurantThumbnailUrl ||
                    fallbackImage;

                  return (
                    <article
                      key={post.id}
                      className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                    >
                      <div className="relative h-56 shrink-0 overflow-hidden bg-slate-100">
                        <img
                          src={displayImage}
                          alt={post.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackImage;
                          }}
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
                              {post.category || "Chưa phân loại"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.createdAt)}
                            </span>
                          </div>

                          <h2 className="line-clamp-1 text-xl font-extrabold text-slate-900">
                            {post.title}
                          </h2>

                          {post.restaurantName && (
                            <p className="flex items-center gap-1 text-sm text-slate-500">
                              <Store className="h-4 w-4 shrink-0 text-slate-400" />
                              {post.restaurantName}
                            </p>
                          )}

                          {post.authorName && (
                            <p className="flex items-center gap-1 text-sm text-slate-500">
                              <User className="h-4 w-4 shrink-0 text-slate-400" />
                              {post.authorName}
                            </p>
                          )}

                          {post.content && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                              {post.content}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-red-400" />
                              {post.likeCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 text-blue-400" />
                              {post.commentCount}
                            </span>
                            <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
                              {post.status}
                            </span>
                          </div>

                          {post.status === "REJECTED" && post.rejectReason && (
                            <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-xs italic text-red-700">
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-red-500 not-italic">
                                Lý do từ chối:
                              </span>
                              "{post.rejectReason}"
                            </div>
                          )}
                        </div>

                        {post.status === "PENDING" && (
                          <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-4">
                            <button
                              onClick={() => {
                                setActivePost(post);
                                setApproveOpen(true);
                              }}
                              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100"
                            >
                              <Check className="h-4 w-4" />
                              Duyệt
                            </button>

                            <button
                              onClick={() => {
                                setActivePost(post);
                                setRejectOpen(true);
                              }}
                              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
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

            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-500">
                  Trang{" "}
                  <span className="font-semibold text-slate-900">
                    {page + 1}
                  </span>{" "}
                  /{" "}
                  <span className="font-semibold text-slate-900">
                    {totalPages}
                  </span>{" "}
                  ({totalElements} posts)
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
                    disabled={last}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl px-4 py-2"
                  >
                    Trang sau
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="relative w-full md:max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={foodQuery}
                  onChange={(e) => setFoodQuery(e.target.value)}
                  placeholder="Tìm bài chia sẻ món ăn..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                {foodStatusTabs.map((tab) => {
                  const isActive = foodStatusFilter === tab.value;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setFoodStatusFilter(tab.value);
                        setFoodPage(0);
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

            {foodLoading ? (
              <div className="flex h-64 items-center justify-center text-lg text-slate-500">
                <span className="animate-pulse">
                  Đang tải bài chia sẻ món ăn...
                </span>
              </div>
            ) : foodError ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                {foodError}
              </div>
            ) : foodPosts.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                <p className="text-lg font-medium">
                  Không tìm thấy bài chia sẻ món ăn.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {foodPosts.map((post) => (
                  <article
                    key={post.id}
                    className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="relative h-56 shrink-0 overflow-hidden bg-slate-100">
                      <img
                        src={post.imageUrl || fallbackImage}
                        alt={post.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700">
                            {post.status}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.createdAt)}
                          </span>
                        </div>

                        <h2 className="line-clamp-1 text-xl font-extrabold text-slate-900">
                          {post.title}
                        </h2>

                        <p className="flex items-center gap-1 text-sm text-slate-500">
                          <Store className="h-4 w-4 shrink-0 text-slate-400" />
                          {post.restaurantName || "Chưa có nhà hàng"}
                        </p>

                        <p className="flex items-center gap-1 text-sm text-slate-500">
                          <Tag className="h-4 w-4 shrink-0 text-slate-400" />
                          {post.categoryName || "Chưa có danh mục"}
                        </p>

                        <p className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                          <Heart className="h-4 w-4 shrink-0 text-red-400" />
                          {post.likesCount} lượt thích
                        </p>

                        {post.description && (
                          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                            {post.description}
                          </p>
                        )}
                      </div>

                      {post.status === "PENDING" && (
                        <div className="mt-2 flex items-center gap-2 border-t border-slate-100 pt-4">
                          <button
                            onClick={() => {
                              setActiveFoodPost(post);
                              setFoodAction("APPROVE");
                            }}
                            disabled={foodActionLoadingId === post.id}
                            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Check className="h-4 w-4" />
                            Duyệt
                          </button>

                          <button
                            onClick={() => {
                              setActiveFoodPost(post);
                              setFoodAction("REJECT");
                            }}
                            disabled={foodActionLoadingId === post.id}
                            className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <X className="h-4 w-4" />
                            Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!foodLoading && foodPosts.length > 0 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-500">
                  Trang{" "}
                  <span className="font-semibold text-slate-900">
                    {foodPage + 1}
                  </span>
                  {foodTotalPages > 0 && (
                    <>
                      {" "}
                      /{" "}
                      <span className="font-semibold text-slate-900">
                        {foodTotalPages}
                      </span>
                    </>
                  )}
                  {foodTotalElements !== null &&
                    ` (${foodTotalElements} posts)`}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={foodPage === 0}
                    onClick={() => setFoodPage((p) => p - 1)}
                    className="rounded-xl px-4 py-2"
                  >
                    Trang trước
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!hasFoodNextPage}
                    onClick={() => setFoodPage((p) => p + 1)}
                    className="rounded-xl px-4 py-2"
                  >
                    Trang sau
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-xl">
          <DialogHeader>
            <DialogTitle>Duyệt bài đăng chủ quán</DialogTitle>
            <DialogDescription className="text-slate-500">
              Duyệt{" "}
              <strong className="text-slate-900">"{activePost?.title}"</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
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
              className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              {actionLoading ? "Đang xử lý..." : "Xác nhận duyệt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-xl">
          <DialogHeader>
            <DialogTitle>Từ chối bài đăng chủ quán</DialogTitle>
            <DialogDescription className="text-slate-500">
              Nhập lý do từ chối cho{" "}
              <strong className="text-slate-900">"{activePost?.title}"</strong>.
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
              placeholder="Nhập lý do từ chối..."
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
              className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(activeFoodPost && foodAction)}
        onOpenChange={(open) => {
          if (open) return;
          setActiveFoodPost(null);
          setFoodAction(null);
          setFoodRejectReason("");
        }}
      >
        <DialogContent className="sm:max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-950 shadow-xl">
          <DialogHeader>
            <DialogTitle>
              {foodAction === "APPROVE"
                ? "Duyệt bài chia sẻ món ăn"
                : "Từ chối bài chia sẻ món ăn"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {foodAction === "APPROVE" ? "Duyệt" : "Từ chối"}{" "}
              <strong className="text-slate-900">
                "{activeFoodPost?.title}"
              </strong>
              ?
            </DialogDescription>
          </DialogHeader>

          {foodAction === "REJECT" && (
            <div className="my-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Lý do từ chối *
              </label>
              <textarea
                rows={4}
                value={foodRejectReason}
                onChange={(e) => setFoodRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
              />
            </div>
          )}

          <DialogFooter className="mt-4 flex flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActiveFoodPost(null);
                setFoodAction(null);
                setFoodRejectReason("");
              }}
              disabled={Boolean(foodActionLoadingId)}
              className="rounded-xl px-4 py-2"
            >
              Hủy
            </Button>

            <Button
              type="button"
              onClick={handleFoodAction}
              disabled={
                Boolean(foodActionLoadingId) ||
                (foodAction === "REJECT" && !foodRejectReason.trim())
              }
              className={`rounded-xl px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                foodAction === "APPROVE"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {foodActionLoadingId ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
