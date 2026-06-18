import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { restaurants } from "@/data/restaurants";
import {
  createRestaurantReview,
  getRestaurant,
  getRestaurantReviews,
} from "@/services/restaurant.service";
import { useAuthStore } from "@/store/authStore";
import type {
  RestaurantResponse,
  ReviewResponse,
} from "@/types/restaurant";

const tabLabels = ["Thông tin", "Thực đơn", "Đánh giá", "Giới thiệu"] as const;
type Tab = (typeof tabLabels)[number];

const tabIcons: Record<Tab, string> = {
  "Thông tin": "ℹ️",
  "Thực đơn": "🍽️",
  "Đánh giá": "⭐",
  "Giới thiệu": "📖",
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const accessToken = useAuthStore((state) => state.accessToken);
  const restaurantId = Number(id);
  const usesApi = Number.isInteger(restaurantId) && restaurantId > 0;
  const [apiRestaurant, setApiRestaurant] =
    useState<RestaurantResponse | null>(null);
  const [apiReviews, setApiReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(usesApi && Boolean(accessToken));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Thông tin");
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (!usesApi) {
      return;
    }

    if (!accessToken) {
      return;
    }

    let cancelled = false;

    Promise.all([
      getRestaurant(restaurantId),
      getRestaurantReviews(restaurantId),
    ])
      .then(([restaurantResponse, reviewsResponse]) => {
        if (!cancelled) {
          setApiRestaurant(restaurantResponse);
          setApiReviews(reviewsResponse);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Không thể tải thông tin nhà hàng.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, restaurantId, usesApi]);

  const restaurant = useMemo(() => {
    if (!usesApi) {
      return restaurants.find((item) => item.id === id);
    }
    if (!apiRestaurant) {
      return undefined;
    }

    const rating =
      apiReviews.length > 0
        ? apiReviews.reduce((total, review) => total + review.rating, 0) /
          apiReviews.length
        : 0;

    return {
      id: String(apiRestaurant.id),
      name: apiRestaurant.name,
      location: apiRestaurant.address ?? "Chưa cập nhật địa chỉ",
      hours: "Chưa cập nhật",
      priceRange: "Chưa cập nhật",
      rating: Number(rating.toFixed(1)),
      reviews: apiReviews.length,
      category: apiRestaurant.typeRestaurantName,
      tags: [apiRestaurant.typeRestaurantName],
      image:
        apiRestaurant.mediaList[0]?.url ??
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      intro: apiRestaurant.description ?? "Nhà hàng chưa có mô tả.",
      address: apiRestaurant.address ?? "Chưa cập nhật địa chỉ",
      phone: apiRestaurant.phoneNumber ?? "Chưa cập nhật",
      mapAlt: `Bản đồ ${apiRestaurant.name}`,
      menu: [],
      reviewsList: apiReviews.map((review) => ({
        name: `Người dùng #${review.userId}`,
        rating: review.rating,
        date: "",
        comment: review.context,
      })),
      features: [apiRestaurant.typeRestaurantName],
    };
  }, [apiRestaurant, apiReviews, id, usesApi]);

  const handleSubmitReview = async () => {
    if (!usesApi || !reviewText.trim() || selectedRating === 0) {
      return;
    }

    try {
      setIsSubmittingReview(true);
      const createdReview = await createRestaurantReview(restaurantId, {
        rating: selectedRating,
        context: reviewText.trim(),
      });
      setApiReviews((current) => [createdReview, ...current]);
      setReviewText("");
      setSelectedRating(0);
      toast.success("Gửi đánh giá thành công.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể gửi đánh giá.",
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <p className="text-sm font-medium text-slate-500">
            Đang tải thông tin nhà hàng...
          </p>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center p-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-12 shadow-2xl text-center max-w-md">
            <div className="text-5xl">🔍</div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Không tìm thấy nhà hàng</h1>
            <p className="mt-3 text-sm text-slate-500">
              {(usesApi && !accessToken
                ? "Vui lòng đăng nhập để xem dữ liệu nhà hàng từ hệ thống."
                : loadError) ??
                "Địa điểm này không tồn tại hoặc đã bị xoá. Vui lòng quay lại trang chủ."}
            </p>
            <Link to="/">
              <Button className="mt-6 rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                ← Về trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden bg-slate-800 md:h-80">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 transition mb-3">
                ← Quay lại
              </Link>
              <h1 className="text-3xl font-extrabold text-white drop-shadow-lg md:text-4xl">
                {restaurant.name}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
                <span>📍</span> {restaurant.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm">
                <span className="text-amber-400">★</span>
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-white/70 text-xs">({restaurant.reviews})</span>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg backdrop-blur-sm transition ${
                  isFavorite ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {isFavorite ? "♥" : "♡"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          {/* Main Column */}
          <div className="space-y-6">
            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: "🕐", label: "Giờ mở cửa", value: restaurant.hours },
                { icon: "💰", label: "Khoảng giá", value: restaurant.priceRange },
                { icon: "📞", label: "Điện thoại", value: restaurant.phone },
                { icon: "🏷️", label: "Danh mục", value: restaurant.category },
              ].map((info) => (
                <div key={info.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-xl">{info.icon}</div>
                  <p className="mt-2 text-xs font-medium text-slate-500">{info.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 leading-snug">{info.value}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {restaurant.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
                  {tag}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
                {tabLabels.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveTab(label)}
                    className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all ${
                      activeTab === label
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{tabIcons[label]}</span>
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Thông tin Tab */}
                {activeTab === "Thông tin" && (
                  <div className="space-y-5">
                    <p className="leading-relaxed text-slate-600">{restaurant.intro}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Địa chỉ</p>
                        <p className="text-sm font-medium text-slate-900">{restaurant.address}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Điện thoại</p>
                        <p className="text-sm font-medium text-slate-900">{restaurant.phone}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Giờ mở cửa</p>
                        <p className="text-sm font-medium text-slate-900">{restaurant.hours}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Khoảng giá</p>
                        <p className="text-sm font-medium text-slate-900">{restaurant.priceRange}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Thực đơn Tab */}
                {activeTab === "Thực đơn" && (
                  <div className="space-y-3">
                    {restaurant.menu.map((dish) => (
                      <div
                        key={dish.name}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg">
                            🍽️
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{dish.name}</p>
                            <p className="text-xs text-slate-500">{dish.category}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white">
                          {dish.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Đánh giá Tab */}
                {activeTab === "Đánh giá" && (
                  <div className="space-y-6">
                    {/* Write Review */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="font-semibold text-slate-900">Viết đánh giá của bạn</p>
                      <div className="mt-3 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setSelectedRating(star)}
                            className="text-2xl transition-transform hover:scale-125"
                          >
                            <span className={(hoverRating || selectedRating) >= star ? "text-amber-400" : "text-slate-300"}>
                              ★
                            </span>
                          </button>
                        ))}
                        {selectedRating > 0 && (
                          <span className="ml-2 text-sm font-medium text-slate-600">
                            {["", "Tệ", "Kém", "Bình thường", "Tốt", "Xuất sắc"][selectedRating]}
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition resize-none"
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-400">{reviewText.length}/500 ký tự</span>
                        <Button
                          onClick={handleSubmitReview}
                          disabled={
                            !usesApi ||
                            !reviewText.trim() ||
                            selectedRating === 0 ||
                            isSubmittingReview
                          }
                          className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {usesApi
                            ? isSubmittingReview
                              ? "Đang gửi..."
                              : "Gửi đánh giá"
                            : "Chỉ áp dụng cho dữ liệu API"}
                        </Button>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {restaurant.reviewsList.map((review) => (
                        <div
                          key={review.name + review.date}
                          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                                {review.name.slice(0, 1)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{review.name}</p>
                                <p className="text-xs text-slate-400">{review.date}</p>
                              </div>
                            </div>
                            <div className="flex gap-0.5 text-amber-400">
                              {[...Array(5)].map((_, idx) => (
                                <span key={idx} className={idx < review.rating ? "text-amber-400" : "text-slate-200"}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Giới thiệu Tab */}
                {activeTab === "Giới thiệu" && (
                  <div className="space-y-5">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Các thuộc tính này được khách hàng đề xuất và quản trị viên xác nhận.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {restaurant.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3"
                        >
                          <span className="text-emerald-500 text-lg">✓</span>
                          <span className="text-sm font-medium text-emerald-800">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Map placeholder */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">📍 Bản đồ</p>
              <div
                className="mt-4 h-64 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center"
                aria-label={restaurant.mapAlt}
              >
                <div className="text-center">
                  <div className="text-5xl">🗺️</div>
                  <p className="mt-2 text-sm text-slate-500">Xem vị trí trên bản đồ</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{restaurant.address}</p>
              <Button className="mt-4 w-full rounded-2xl border border-emerald-600 bg-transparent px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 transition">
                Mở Google Maps →
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Hành động nhanh</p>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isFavorite
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <span className="text-lg">{isFavorite ? "♥" : "♡"}</span>
                {isFavorite ? "Đã lưu vào yêu thích" : "Thêm vào yêu thích"}
              </button>
              <button
                onClick={() => setActiveTab("Đánh giá")}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <span className="text-lg">⭐</span>
                Viết đánh giá
              </button>
              <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition">
                <span className="text-lg">📤</span>
                Chia sẻ
              </button>
            </div>

            {/* Rating summary */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Đánh giá tổng quan</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-slate-900">{restaurant.rating}</p>
                  <div className="mt-1 flex gap-0.5 justify-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(restaurant.rating) ? "text-amber-400" : "text-slate-200"}>★</span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{restaurant.reviews} đánh giá</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-slate-400">{star}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 7 : 3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
