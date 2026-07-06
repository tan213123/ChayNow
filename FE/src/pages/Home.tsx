import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {
  Calendar,
  Heart,
  Leaf,
  MapPin,
  MessageSquare,
  PartyPopper,
  Pencil,
  Phone,
  Search,
  Send,
  Share2,
  Store,
  Utensils,
  Star,
  ImagePlus,
  X,
} from "lucide-react";
import { getRestaurants } from "@/services/restaurant.service";
import { getEvents } from "@/services/event.service";
import { getMenus } from "@/services/menu.service";
import { getComments, createComment, type CommentResponse } from "@/services/comment.service";
import type { RestaurantResponse, EventResponse, MenuResponse } from "@/types/restaurant";
import { createPosting, getPublicPostings, uploadPostingImage, type PostingResponse } from "@/services/posting.service";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { refreshCurrentPageSoon } from "@/lib/refreshPage";

const tabs = ["Địa điểm ăn chay", "Món ăn nổi bật", "Sự kiện", "Bài đăng cộng đồng"] as const;
type Tab = (typeof tabs)[number];

const categoryFilters = ["Tất cả", "Cao Cấp", "Bình Dân", "Từ Thiện"];
const postCategoryOptions = [
  { value: "OTHER", label: "Chia sẻ chung" },
  { value: "MAIN_DISH", label: "Món chính" },
  { value: "APPETIZER", label: "Khai vị" },
  { value: "DRINK", label: "Đồ uống" },
  { value: "DESSERT", label: "Tráng miệng" },
];

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postCategory, setPostCategory] = useState(postCategoryOptions[0].value);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // API data
  const [apiRestaurants, setApiRestaurants] = useState<RestaurantResponse[]>([]);
  const [apiEvents, setApiEvents] = useState<EventResponse[]>([]);
  const [apiMenus, setApiMenus] = useState<MenuResponse[]>([]);
  const [apiPostings, setApiPostings] = useState<PostingResponse[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Comments state
  const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [apiComments, setApiComments] = useState<CommentResponse[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  
  const [likedPosts, setLikedPosts] = useState<number[]>(() => {
    const saved = localStorage.getItem("communityLikedPosts");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleComments = async (postId: number) => {
    if (activeCommentPostId === postId) {
      setActiveCommentPostId(null);
      return;
    }
    setActiveCommentPostId(postId);
    setLoadingComments(true);
    try {
      const res = await getComments(postId);
      setApiComments(res.content || []);
    } catch (error) {
      console.error("Failed to fetch comments", error);
      setApiComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCreateComment = async (postId: number) => {
    if (!commentInput.trim()) return;
    try {
      const newComment = await createComment(postId, commentInput);
      setApiComments((prev) => [newComment, ...prev]);
      setCommentInput("");
      refreshCurrentPageSoon();
    } catch (error) {
      console.error("Failed to create comment", error);
    }
  };

  const handleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để viết bài.");
      return;
    }

    if (postTitle.trim().length < 2 || postContent.trim().length < 10) {
      toast.error("Tiêu đề cần ít nhất 2 ký tự và nội dung cần ít nhất 10 ký tự.");
      return;
    }

    setIsCreatingPost(true);
    try {
      await createPosting({
        title: postTitle.trim(),
        content: postContent.trim(),
        category: postCategory,
        imageUrl: postImageUrl.trim() || undefined,
      });
      setPostTitle("");
      setPostContent("");
      setPostCategory(postCategoryOptions[0].value);
      setPostImageUrl("");
      toast.success("Đã gửi bài đăng. Bài sẽ hiển thị sau khi admin duyệt.");
      refreshCurrentPageSoon();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo bài đăng.");
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const response = await uploadPostingImage(file);
      if (response.data?.url) {
        setPostImageUrl(response.data.url);
        toast.success("Tải ảnh bài đăng lên thành công");
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message.includes("timeout")
          ? "Tải ảnh quá lâu. Vui lòng thử lại hoặc chọn ảnh nhỏ hơn."
          : error instanceof Error
            ? error.message
            : "Lỗi khi tải ảnh lên";
      toast.error(message);
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  useEffect(() => {
    localStorage.setItem("communityLikedPosts", JSON.stringify(likedPosts));
  }, [likedPosts]);

  useEffect(() => {
    Promise.allSettled([getRestaurants(), getEvents(), getMenus(), getPublicPostings()]).then(
      ([restResult, eventsResult, menusResult, postingsResult]) => {
        if (restResult.status === "fulfilled") setApiRestaurants(restResult.value);
        if (eventsResult.status === "fulfilled") setApiEvents(eventsResult.value);
        if (menusResult.status === "fulfilled") setApiMenus(menusResult.value);
        if (postingsResult.status === "fulfilled") setApiPostings(postingsResult.value.content || []);
        setDataLoading(false);
      },
    );
  }, []);

  const filteredRestaurants = apiRestaurants.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.address ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "Tất cả" ||
      (r.typeRestaurantName &&
        r.typeRestaurantName.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchSearch && matchCategory;
  });

  const renderCards = () => {
    // Loading skeleton
    if (dataLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm animate-pulse">
              <div className="h-56 bg-slate-200" />
              <div className="space-y-3 p-6">
                <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                <div className="h-3 w-1/2 rounded-full bg-slate-200" />
                <div className="h-10 rounded-2xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (selectedTab === "Địa điểm ăn chay") {
      const FALLBACK_IMG = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80";
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.length === 0 ? (
            <div className="col-span-3 py-20 text-center">
              <Search className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-slate-500">Không tìm thấy kết quả phù hợp</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("Tất cả"); }}
                className="mt-3 text-sm font-medium text-emerald-600 hover:underline"
              >
                Xoá bộ lọc
              </button>
            </div>
          ) : (
            filteredRestaurants.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={item.mediaList[0]?.url ?? FALLBACK_IMG}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <span className="absolute left-4 top-4 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {item.typeRestaurantName}
                  </span>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0" /> {item.address ?? "Chưa cập nhật"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.typeRestaurantName && (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {item.typeRestaurantName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {item.phoneNumber ?? "Chưa cập nhật"}</span>
                  </div>
                  <Link to={`/restaurant/${item.id}?tab=menu`}>
                    <Button className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition">
                      Xem chi tiết →
                    </Button>
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      );
    }

    if (selectedTab === "Món ăn nổi bật") {
      const DISH_FALLBACK = "https://images.unsplash.com/photo-1512058564366-c9e0de9e8c4f?auto=format&fit=crop&w=1200&q=80";
      return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {apiMenus.length === 0 ? (
            <div className="col-span-4 py-20 text-center">
              <Utensils className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-slate-500">Chưa có món ăn nào</p>
            </div>
          ) : (
            apiMenus.map((dish) => (
              <Link
                key={dish.id}
                to={`/restaurant/${dish.restaurantId}?tab=menu`}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={dish.imageUrl ?? DISH_FALLBACK} alt={dish.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-emerald-700 backdrop-blur-sm">
                    {dish.category ?? "Món ăn"}
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="font-bold text-slate-900 leading-snug">{dish.name}</h3>
                  <p className="text-sm font-semibold text-emerald-600">
                    {dish.price != null ? `${dish.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}
                  </p>
                  {dish.description && (
                    <p className="text-xs text-slate-400 line-clamp-2">{dish.description}</p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      );
    }

    if (selectedTab === "Sự kiện") {
      const EVENT_FALLBACK = "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80";
      const statusLabel: Record<string, string> = { UPCOMING: "Sắp diễn ra", ACTIVE: "Đang diễn ra", EXPIRED: "Đã kết thúc" };
      const typeLabel: Record<string, string> = { CHARITY: "Từ thiện", DISCOUNT: "Giảm giá" };
      const visibleEvents = apiEvents.filter((e) => e.status !== "HIDDEN");
      return (
        <div className="grid gap-6 lg:grid-cols-3">
          {visibleEvents.length === 0 ? (
            <div className="col-span-3 py-20 text-center">
              <PartyPopper className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-slate-500">Chưa có sự kiện nào</p>
            </div>
          ) : (
            visibleEvents.map((event) => (
              <article key={event.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img src={event.imageUrl ?? EVENT_FALLBACK} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {event.eventType && (
                    <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {typeLabel[event.eventType] ?? event.eventType}
                    </span>
                  )}
                  {event.status && (
                    <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
                      event.status === "ACTIVE" ? "bg-emerald-600" : "bg-amber-500"
                    }`}>
                      {statusLabel[event.status] ?? event.status}
                    </span>
                  )}
                </div>
                <div className="space-y-3 p-6">
                  <h3 className="font-bold text-slate-900">{event.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{event.description}</p>
                  <div className="border-t border-slate-100 pt-3 space-y-1 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.restaurantName ?? "Chưa cập nhật"}</p>
                    {event.startDate && event.endDate && (
                      <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />
                        {new Intl.DateTimeFormat("vi-VN").format(new Date(event.startDate))} –{" "}
                        {new Intl.DateTimeFormat("vi-VN").format(new Date(event.endDate))}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      );
    }

    // ── COMMUNITY POSTS TAB ──────────────────────────────────────────
    if (selectedTab === "Bài đăng cộng đồng") {
      return (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-slate-500">
              Khám phá những bài đăng và đánh giá mới nhất từ cộng đồng về các quán chay.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">Viết bài đăng</h3>
                  <p className="mt-1 text-xs text-slate-500">Bài viết sẽ được gửi duyệt trước khi hiển thị công khai.</p>
                </div>
              </div>
              <input
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                maxLength={255}
                placeholder="Tiêu đề bài đăng..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Chia sẻ trải nghiệm, món chay ngon hoặc câu chuyện của bạn..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />
              <div className="grid gap-3 md:grid-cols-[180px_1fr_auto] md:items-center">
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                >
                  {postCategoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      value={postImageUrl}
                      onChange={(e) => setPostImageUrl(e.target.value)}
                      placeholder="URL ảnh minh họa (không bắt buộc)"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 pr-10"
                    />
                    <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 text-slate-400 hover:text-violet-600 transition-colors">
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
                      <ImagePlus className="h-5 w-5" />
                    </label>
                  </div>
                  {postImageUrl && (
                    <div className="relative h-11 w-11 shrink-0 rounded-xl border border-slate-200 overflow-hidden">
                      <img src={postImageUrl} alt="Preview" className="h-full w-full object-cover" />
                      <button 
                        onClick={() => setPostImageUrl("")}
                        className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleCreatePost}
                  disabled={isCreatingPost || !postTitle.trim() || !postContent.trim()}
                  className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {isCreatingPost ? "Đang gửi..." : "Đăng bài"}
                </Button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          {apiPostings.length === 0 ? (
            <div className="py-16 text-center">
              <Leaf className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-slate-500">Chưa có bài đăng nào</p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {apiPostings.map((post) => (
                <article
                  key={post.id}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Post header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 overflow-hidden">
                        {post.authorAvatarUrl ? <img src={post.authorAvatarUrl} className="h-full w-full object-cover" /> : (post.authorName ? post.authorName.charAt(0).toUpperCase() : "U")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{post.authorName || "Người dùng ẩn danh"}</p>
                        <p className="text-xs text-slate-400">{new Intl.DateTimeFormat('vi-VN').format(new Date(post.createdAt))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Restaurant info */}
                  {post.restaurantName && (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{post.restaurantName}</h3>
                        <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                          {post.category || "Bài Đăng"}
                        </span>
                      </div>
                      {post.restaurantAddress && (
                        <p className="flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin className="h-4 w-4 shrink-0" /> {post.restaurantAddress}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Title & Description */}
                  <h4 className="mt-3 font-bold text-slate-900">{post.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Image (if exists) */}
                  {post.thumbnailUrl && (
                    <div className="mt-3 h-48 w-full overflow-hidden rounded-xl">
                      <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                        likedPosts.includes(post.id)
                          ? "bg-red-50 text-red-500"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                      <span>{post.likeCount + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                      <span className="text-xs">Hữu ích</span>
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleComments(post.id)}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Bình luận ({post.commentCount || 0})
                      </button>
                      <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                        <Share2 className="h-3.5 w-3.5" /> Chia sẻ
                      </button>
                    </div>
                  </div>

                  {/* Comment Section */}
                  {activeCommentPostId === post.id && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <div className="space-y-4 mb-4">
                        {loadingComments ? (
                          <p className="text-sm text-slate-400 text-center py-2">Đang tải bình luận...</p>
                        ) : apiComments.length === 0 ? (
                          <p className="text-sm text-slate-400 text-center py-2">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                        ) : (
                          apiComments.map(comment => (
                            <div key={comment.id} className="flex gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 overflow-hidden">
                                {comment.authorAvatarUrl ? <img src={comment.authorAvatarUrl} className="h-full w-full object-cover" /> : (comment.authorName ? comment.authorName.charAt(0).toUpperCase() : "U")}
                              </div>
                              <div className="flex-1 rounded-2xl bg-slate-50 px-4 py-2 text-sm">
                                <p className="font-semibold text-slate-900">{comment.authorName || "Người dùng ẩn danh"}</p>
                                <p className="text-slate-600">{comment.content}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                          BN
                        </div>
                        <input
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateComment(post.id);
                          }}
                          placeholder="Viết bình luận..."
                          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-violet-400 focus:bg-white transition"
                        />
                        <button
                          onClick={() => handleCreateComment(post.id)}
                          disabled={!commentInput.trim()}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white disabled:opacity-50 transition"
                        >
                          <Send className="h-4 w-4 -ml-0.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  const counts = {
    "Địa điểm ăn chay": filteredRestaurants.length,
    "Món ăn nổi bật": apiMenus.length,
    "Sự kiện": apiEvents.filter((e) => e.status !== "HIDDEN").length,
    "Bài đăng cộng đồng": apiPostings.length,
  };

  const tabIcons: Record<Tab, React.FC<any>> = {
    "Địa điểm ăn chay": Store,
    "Món ăn nổi bật": Utensils,
    "Sự kiện": PartyPopper,
    "Bài đăng cộng đồng": Pencil,
  };

  const countLabels: Record<Tab, string> = {
    "Địa điểm ăn chay": "địa điểm",
    "Món ăn nổi bật": "món ăn",
    "Sự kiện": "sự kiện",
    "Bài đăng cộng đồng": "bài đăng",
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-500 to-teal-600 px-6 py-20">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-emerald-800/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-5">
            <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <Leaf className="mr-2 inline h-4 w-4" /> Cộng đồng ẩm thực chay TPHCM
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Khám phá <span className="text-emerald-200">ẩm thực chay</span> ngon nhất Sài Gòn
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Tìm kiếm địa điểm ăn chay ngon, sạch và uy tín. Hàng trăm nhà hàng và quán chay đang chờ bạn khám phá.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm quán ăn, địa chỉ..."
                className="min-w-0 flex-1 rounded-3xl border border-white/30 bg-white/95 px-6 py-4 text-slate-900 shadow-lg outline-none placeholder:text-slate-400 focus:border-white focus:ring-4 focus:ring-white/20 transition"
              />
              <Button className="min-w-[140px] h-auto rounded-3xl bg-slate-950 hover:bg-slate-900 border border-white/10 px-6 py-4 text-sm font-bold text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-950/20 active:scale-[0.98] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group">
                <Search className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
                <span>Tìm kiếm</span>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {selectedTab === "Địa điểm ăn chay" && (
          <div className="mb-6 flex flex-wrap gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          {/* Tab Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tabIcons[tab];
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedTab(tab)}
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                      selectedTab === tab
                        ? tab === "Bài đăng cộng đồng"
                          ? "bg-violet-600 text-white shadow-sm"
                          : "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab}
                    {tab === "Bài đăng cộng đồng" && (
                      <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${selectedTab === tab ? "bg-white/25 text-white" : "bg-violet-100 text-violet-700"}`}>
                        {apiPostings.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <div className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedTab === "Bài đăng cộng đồng" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>
                {counts[selectedTab]} {countLabels[selectedTab]}
              </div>
            </div>
          </div>

          <div className="mt-8">{renderCards()}</div>
        </div>

        {/* Features Banner */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Leaf, title: "100% Thuần chay", desc: "Tất cả địa điểm đều được xác minh và cam kết thuần chay" },
            { icon: Star, title: "Đánh giá thực", desc: "Hàng nghìn đánh giá từ cộng đồng người dùng thực tế" },
            { icon: MapPin, title: "Khắp TPHCM", desc: "Từ quận 1 đến vùng ngoại ô, chúng tôi có mặt ở mọi nơi" },
          ].map((f) => (
            <div key={f.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm text-center">
              <f.icon className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-3 font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
