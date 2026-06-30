import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import RestaurantMap from "@/components/RestaurantMap";
import {
  AlertTriangle,
  Calendar,
  Camera,
  Check,
  Clock,
  DollarSign,
  Flag,
  Heart,
  Info,
  KeyRound,
  MapPin,
  PartyPopper,
  Phone,
  Plus,
  Search,
  Star,
  Tag,
  Utensils,
  Users,
  X,
} from "lucide-react";
import {
  clickReviewTestOption,
  createRestaurantReview,
  getRestaurant,
  getRestaurantReviews,
  getReviewTestOptions,
  unclickReviewTestOption,
} from "@/services/restaurant.service";
import { getRestaurantEvents } from "@/services/event.service";
import { getRestaurantMenus } from "@/services/menu.service";
import { getPlace } from "@/services/place.service";
import { mediaService } from "@/services/media.service";
import { useAuthStore } from "@/store/authStore";
import { addFavourite, isFavourite, removeFavourite } from "@/services/favourite.service";
import { createReport } from "@/services/report.service";
import type {
  RestaurantResponse,
  ReviewResponse,
  EventResponse,
  MenuResponse,
  ReviewTestOptionResponse,
} from "@/types/restaurant";

const tabLabels = ["Thông tin", "Sự kiện", "Thực đơn", "Đánh giá"] as const;
type Tab = (typeof tabLabels)[number];

const tabIcons: Record<Tab, React.FC<any>> = {
  "Thông tin": Info,
  "Sự kiện": PartyPopper,
  "Thực đơn": Utensils,
  "Đánh giá": Star,
};

const visibleReviewOptionCount = 4;
const visibleReviewStatsCount = 4;

export default function RestaurantDetail() {
  const { id } = useParams();
  const location = useLocation();
  const restaurantId = Number(id);
  const isValidId = Number.isInteger(restaurantId) && restaurantId > 0;
  const [apiRestaurant, setApiRestaurant] =
    useState<RestaurantResponse | null>(null);
  const [apiReviews, setApiReviews] = useState<ReviewResponse[]>([]);
  const [apiEvents, setApiEvents] = useState<EventResponse[]>([]);
  const [apiMenus, setApiMenus] = useState<MenuResponse[]>([]);
  const [placeMapUrl, setPlaceMapUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isValidId);
  const { user } = useAuthStore();
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Thông tin");
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [reviewTestOptions, setReviewTestOptions] = useState<
    ReviewTestOptionResponse[]
  >([]);
  const [savingOptionId, setSavingOptionId] = useState<number | null>(null);
  const [showAllReviewOptions, setShowAllReviewOptions] = useState(false);
  const [showAllReviewStats, setShowAllReviewStats] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetTab = params.get("tab") ?? location.hash.replace("#", "");
    if (targetTab === "menu") {
      setActiveTab(tabLabels[2]);
    }
  }, [location.search, location.hash]);

  // Báo cáo state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: "RESTAURANT" | "REVIEW"; id: number } | null>(null);

  const isOwner = useMemo(() => {
    return user?.id !== undefined && apiRestaurant?.ownerId !== undefined && user.id === apiRestaurant.ownerId;
  }, [user, apiRestaurant]);

  const sortedReviewTestOptions = useMemo(
    () =>
      [...reviewTestOptions].sort((a, b) => {
        if (b.clickCount !== a.clickCount) return b.clickCount - a.clickCount;
        return a.id - b.id;
      }),
    [reviewTestOptions],
  );

  const visibleReviewTestOptions = useMemo(
    () =>
      showAllReviewOptions
        ? sortedReviewTestOptions
        : sortedReviewTestOptions.slice(0, visibleReviewOptionCount),
    [showAllReviewOptions, sortedReviewTestOptions],
  );

  const visibleReviewStatsOptions = useMemo(
    () =>
      showAllReviewStats
        ? sortedReviewTestOptions
        : sortedReviewTestOptions.slice(0, visibleReviewStatsCount),
    [showAllReviewStats, sortedReviewTestOptions],
  );

  useEffect(() => {
    if (!isValidId) return;

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (!cancelled) {
          setIsLoading(true);
          setLoadError(null);
          setPlaceMapUrl(null);
        }

        return Promise.all([
          getRestaurant(restaurantId),
          getRestaurantReviews(restaurantId),
          getRestaurantEvents(restaurantId).catch((err) => {
            console.error("Failed to load events", err);
            return [] as EventResponse[];
          }),
          getRestaurantMenus(restaurantId).catch((err) => {
            console.error("Failed to load menus", err);
            return [] as MenuResponse[];
          }),
          getReviewTestOptions(restaurantId).catch((err) => {
            console.error("Failed to load review test options", err);
            return [] as ReviewTestOptionResponse[];
          }),
          user
            ? isFavourite(restaurantId)
                .then((res) => (res.success ? res.data : false))
                .catch((err) => {
                  console.error("Failed to check favorite status", err);
                  return false;
                })
            : Promise.resolve(false),
        ]);
      })
      .then(([restaurantResponse, reviewsResponse, eventsResponse, menusResponse, reviewOptionResponse, isFavResponse]) => {
        if (!cancelled) {
          setApiRestaurant(restaurantResponse);
          setApiReviews(reviewsResponse);
          setApiEvents(eventsResponse);
          setApiMenus(menusResponse);
          setReviewTestOptions(reviewOptionResponse);
          setIsFavorite(!!isFavResponse);
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
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [restaurantId, isValidId, user]);

  useEffect(() => {
    const placeId = apiRestaurant?.placeId;
    if (!placeId) {
      setPlaceMapUrl(null);
      return;
    }

    let cancelled = false;

    getPlace(placeId)
      .then((place) => {
        if (!cancelled) {
          setPlaceMapUrl(place.mapUrl);
        }
      })
      .catch((err) => {
        console.error("Failed to load place map URL", err);
        if (!cancelled) {
          setPlaceMapUrl(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiRestaurant?.placeId]);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để lưu địa điểm yêu thích!");
      return;
    }
    try {
      if (isFavorite) {
        const res = await removeFavourite(restaurantId);
        if (res.success) {
          setIsFavorite(false);
          toast.success("Đã xóa khỏi danh sách yêu thích");
        }
      } else {
        const res = await addFavourite(restaurantId);
        if (res.success) {
          setIsFavorite(true);
          toast.success("Đã thêm vào danh sách yêu thích");
        }
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
      toast.error("Đã xảy ra lỗi khi thay đổi trạng thái yêu thích");
    }
  };

  const handleSubmitReport = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để báo cáo!");
      return;
    }
    if (!reportTarget) {
      return;
    }
    if (!reportReason.trim()) {
      toast.error("Vui lòng chọn hoặc nhập lý do báo cáo!");
      return;
    }
    try {
      setIsSubmittingReport(true);
      await createReport({
        targetType: reportTarget.type,
        targetId: reportTarget.id,
        reason: reportReason,
        details: reportDescription,
      });
      toast.success("Đã gửi báo cáo thành công. Quản trị viên sẽ xử lý sớm.");
      setIsReportModalOpen(false);
      setReportReason("");
      setReportDescription("");
      setReportTarget(null);
    } catch (error) {
      toast.error("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const restaurant = useMemo(() => {
    if (!apiRestaurant) return undefined;

    const rating =
      apiReviews.length > 0
        ? apiReviews.reduce((total, review) => total + review.rating, 0) /
          apiReviews.length
        : 0;

    return {
      id: String(apiRestaurant.id),
      name: apiRestaurant.name,
      location: apiRestaurant.address ?? "Chưa cập nhật địa chỉ",
      hours: apiRestaurant.openTime && apiRestaurant.closedTime
        ? `${apiRestaurant.openTime.substring(0, 5)} - ${apiRestaurant.closedTime.substring(0, 5)}`
        : "Chưa cập nhật",
      priceRange: apiMenus.length > 0
        ? `${Math.min(...apiMenus.map((m) => m.price)).toLocaleString("vi-VN")}đ - ${Math.max(...apiMenus.map((m) => m.price)).toLocaleString("vi-VN")}đ`
        : "Chưa cập nhật",
      rating: Number(rating.toFixed(1)),
      reviews: apiReviews.length,
      category: apiRestaurant.typeRestaurantName,
      tags: [apiRestaurant.typeRestaurantName].filter(Boolean),
      image:
        apiRestaurant.mediaList[0]?.url ??
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      intro: apiRestaurant.description ?? "Nhà hàng chưa có mô tả.",
      address: apiRestaurant.address ?? "Chưa cập nhật địa chỉ",
      phone: apiRestaurant.phoneNumber ?? "Chưa cập nhật",
      mapUrl: placeMapUrl,
      mapAlt: `Bản đồ ${apiRestaurant.name}`,
      menu: apiMenus.map((item) => ({
        name: item.name,
        price: item.price != null ? `${item.price.toLocaleString("vi-VN")}đ` : "Liên hệ",
        category: item.category ?? "Món ăn",
        image: item.imageUrl,
      })),
      reviewsList: apiReviews.map((review) => ({
        id: review.id,
        name: review.userName ?? `Người dùng #${review.userId}`,
        rating: review.rating,
        date: review.createdAt
          ? new Intl.DateTimeFormat("vi-VN").format(new Date(review.createdAt))
          : "",
        comment: review.context,
        images: review.mediaList?.map((m) => m.url) ?? [],
      })),
      features: [apiRestaurant.typeRestaurantName].filter(Boolean),
    };
  }, [apiRestaurant, apiReviews, apiMenus, placeMapUrl]);

  const handleReviewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReviewImages(Array.from(e.target.files));
    }
  };

  const syncSuggestionText = (label: string, shouldInclude: boolean) => {
    setReviewText((prev) => {
      const parts = prev
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item) => item !== label);

      if (shouldInclude) {
        parts.push(label);
      }

      return parts.join(", ");
    });
  };

  const handleToggleReviewTestOption = async (option: ReviewTestOptionResponse) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để chọn tiêu chí đánh giá.");
      return;
    }

    const nextClicked = !option.clickedByCurrentUser;
    setSavingOptionId(option.id);
    setReviewTestOptions((current) =>
      current.map((item) =>
        item.id === option.id
          ? {
              ...item,
              clickedByCurrentUser: nextClicked,
              clickCount: Math.max(0, item.clickCount + (nextClicked ? 1 : -1)),
            }
          : item,
      ),
    );
    syncSuggestionText(option.label, nextClicked);

    try {
      if (nextClicked) {
        const updated = await clickReviewTestOption(restaurantId, option.id);
        setReviewTestOptions((current) =>
          current.map((item) => (item.id === option.id ? updated : item)),
        );
      } else {
        await unclickReviewTestOption(restaurantId, option.id);
      }
    } catch (error) {
      setReviewTestOptions((current) =>
        current.map((item) => (item.id === option.id ? option : item)),
      );
      syncSuggestionText(option.label, option.clickedByCurrentUser);
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu tiêu chí.",
      );
    } finally {
      setSavingOptionId(null);
    }
  };

  const handleSubmitReview = async () => {
    if (!isValidId || !reviewText.trim() || selectedRating === 0) return;

    try {
      setIsSubmittingReview(true);
      const createdReview = await createRestaurantReview(restaurantId, {
        rating: selectedRating,
        context: reviewText.trim(),
      });

      if (reviewImages.length > 0) {
        await mediaService.uploadMultiple(reviewImages, restaurantId, createdReview.id);
      }

      const freshReviews = await getRestaurantReviews(restaurantId);
      setApiReviews(freshReviews);
      
      setReviewText("");
      setSelectedRating(0);
      setReviewImages([]);
      toast.success("Gửi đánh giá thành công.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể gửi đánh giá.",
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
            <Search className="mx-auto h-12 w-12 text-slate-300" />
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Không tìm thấy nhà hàng</h1>
            <p className="mt-3 text-sm text-slate-500">
              {loadError ?? "Địa điểm này không tồn tại hoặc đã bị xoá."}
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
                <MapPin className="h-4 w-4 shrink-0" /> {restaurant.address}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-white/70 text-xs">({restaurant.reviews})</span>
              </div>
              <button
                onClick={handleToggleFavorite}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg backdrop-blur-sm transition ${
                  isFavorite ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
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
                { icon: Clock, label: "Giờ mở cửa", value: restaurant.hours },
                { icon: DollarSign, label: "Khoảng giá", value: restaurant.priceRange },
                { icon: Phone, label: "Điện thoại", value: restaurant.phone },
                { icon: Tag, label: "Danh mục", value: restaurant.category },
              ].map((info) => (
                <div key={info.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                  <info.icon className="h-5 w-5 text-emerald-600" />
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
                {tabLabels.map((label) => {
                  const Icon = tabIcons[label];
                  return (
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
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
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
                    <RestaurantMap
                      name={restaurant.name}
                      address={restaurant.address}
                      mapUrl={restaurant.mapUrl}
                    />
                  </div>
                )}

                {/* Sự kiện Tab */}
                {activeTab === "Sự kiện" && (
                  <div className="space-y-6">
                    {apiEvents.filter((e) => e.status !== "HIDDEN").length === 0 ? (
                      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
                        <PartyPopper className="mx-auto h-10 w-10 text-slate-300" />
                        <p className="mt-3 font-semibold text-slate-900">
                          Hiện tại nhà hàng chưa có sự kiện nào.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Hãy quay lại sau để cập nhật các chương trình mới nhất của nhà hàng nhé!
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2">
                        {apiEvents
                          .filter((e) => e.status !== "HIDDEN")
                          .map((event) => {
                            const statusLabels: Record<string, string> = {
                              UPCOMING: "Sắp diễn ra",
                              ACTIVE: "Đang diễn ra",
                              EXPIRED: "Đã kết thúc",
                            };
                            const statusStyles: Record<string, string> = {
                              UPCOMING: "bg-sky-50 text-sky-700 border border-sky-200",
                              ACTIVE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                              EXPIRED: "bg-slate-100 text-slate-600 border border-slate-200",
                            };
                            const typeLabels: Record<string, string> = {
                              CHARITY: "Từ thiện",
                              DISCOUNT: "Giảm giá",
                            };

                            const fallbackImage =
                              "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80";
                            const formattedStart = event.startDate
                              ? new Intl.DateTimeFormat("vi-VN").format(new Date(event.startDate))
                              : "Chưa cập nhật";
                            const formattedEnd = event.endDate
                              ? new Intl.DateTimeFormat("vi-VN").format(new Date(event.endDate))
                              : "Chưa cập nhật";

                            return (
                              <article
                                key={event.id}
                                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col"
                              >
                                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                                  <img
                                    src={event.imageUrl || fallbackImage}
                                    alt={event.title}
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                  />
                                  <span className="absolute left-4 top-4 rounded-xl bg-black/50 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                                    {typeLabels[event.eventType || ""] || "Sự kiện"}
                                  </span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                        {event.title}
                                      </h3>
                                      <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                                          statusStyles[event.status || ""] ||
                                          "bg-slate-50 text-slate-500 border-slate-200"
                                        }`}
                                      >
                                        {statusLabels[event.status || ""] || event.status}
                                      </span>
                                    </div>
                                    <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" /> {formattedStart} - {formattedEnd}
                                    </p>
                                    <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
                                      {event.description ||
                                        "Nhà hàng chưa cung cấp mô tả chi tiết cho sự kiện này."}
                                    </p>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                      </div>
                    )}
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
                          {dish.image ? (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg">
                              <Utensils className="h-5 w-5 text-emerald-600" />
                            </div>
                          )}
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
                    {!user ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center text-slate-600">
                        <KeyRound className="mr-2 inline h-4 w-4" /> Vui lòng <Link to="/login" className="font-semibold text-emerald-600 hover:underline">đăng nhập</Link> để viết đánh giá cho nhà hàng này.
                      </div>
                    ) : isOwner ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 text-center text-amber-800">
                        <AlertTriangle className="mr-2 inline h-4 w-4" /> Bạn là chủ nhà hàng này, do đó không thể đánh giá nhà hàng của chính mình.
                      </div>
                    ) : (
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
                                <Star className="h-7 w-7 fill-current" />
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
                        <div className="mt-3 flex flex-wrap gap-2">
                          {visibleReviewTestOptions.map((option) => {
                            const isSelected = option.clickedByCurrentUser;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleToggleReviewTestOption(option)}
                                disabled={savingOptionId === option.id}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                  isSelected 
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                                }`}
                              >
                                {isSelected ? <Check className="mr-1 inline h-3 w-3" /> : <Plus className="mr-1 inline h-3 w-3" />}
                                {option.label}
                                <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-bold">
                                  <Users className="h-2.5 w-2.5" />
                                  {option.clickCount}
                                </span>
                              </button>
                            );
                          })}
                          {reviewTestOptions.length > visibleReviewOptionCount && (
                            <button
                              type="button"
                              onClick={() => setShowAllReviewOptions((current) => !current)}
                              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                            >
                              {showAllReviewOptions
                                ? "Thu gọn"
                                : `Xem thêm ${reviewTestOptions.length - visibleReviewOptionCount}`}
                            </button>
                          )}
                        </div>
                        {reviewImages.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {reviewImages.map((file, idx) => (
                              <div key={idx} className="relative h-16 w-16 group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="preview"
                                  className="h-full w-full rounded-xl object-cover border border-slate-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => setReviewImages((current) => current.filter((_, i) => i !== idx))}
                                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white shadow hover:bg-rose-600 transition"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isValidId && (
                              <label className="flex items-center gap-1.5 cursor-pointer rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition shadow-sm">
                                <Camera className="h-3.5 w-3.5" /> Thêm ảnh
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleReviewImagesChange}
                                  className="sr-only"
                                />
                              </label>
                            )}
                            <span className="text-xs text-slate-400">{reviewText.length}/500 ký tự</span>
                          </div>
                          <Button
                            onClick={handleSubmitReview}
                            disabled={
                              !isValidId ||
                              !reviewText.trim() ||
                              selectedRating === 0 ||
                              isSubmittingReview
                            }
                            className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {restaurant.reviewsList.map((review) => {
                        const images = (review as { images?: string[] }).images;
                        return (
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
                              <div className="flex flex-col items-end gap-1.5">
                                <div className="flex gap-0.5 text-amber-400">
                                  {[...Array(5)].map((_, idx) => (
                                    <span key={idx} className={idx < review.rating ? "text-amber-400" : "text-slate-200"}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <button
                                  onClick={() => {
                                    if (!user) {
                                      toast.error("Vui lòng đăng nhập để báo cáo!");
                                      return;
                                    }
                                    setReportTarget({ type: "REVIEW", id: review.id });
                                    setIsReportModalOpen(true);
                                  }}
                                  className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition"
                                  title="Báo cáo đánh giá này"
                                >
                                  🚩 Báo cáo
                                </button>
                              </div>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                            {images && images.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {images.map((imgUrl, i) => (
                                  <img
                                    key={i}
                                    src={imgUrl}
                                    alt="Review image"
                                    className="h-20 w-20 rounded-xl object-cover border border-slate-100 shadow-sm"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">


            {/* Quick Actions */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Hành động nhanh</p>
              <button
                onClick={handleToggleFavorite}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isFavorite
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Đã lưu vào yêu thích" : "Thêm vào yêu thích"}
              </button>
              <button
                onClick={() => setActiveTab("Đánh giá")}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <Star className="h-5 w-5" />
                {isOwner ? "Xem đánh giá" : "Viết đánh giá"}
              </button>
              
              <button
                onClick={() => {
                  if (!user) {
                    toast.error("Vui lòng đăng nhập để báo cáo!");
                    return;
                  }
                  setReportTarget({ type: "RESTAURANT", id: restaurantId });
                  setIsReportModalOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition"
              >
                <Flag className="h-5 w-5" />
                Báo cáo nhà hàng
              </button>

            </div>

            <RestaurantMap
              name={restaurant.name}
              address={restaurant.address}
              mapUrl={restaurant.mapUrl}
              compact
              mapClassName="h-64"
            />

            {/* Rating summary */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Đánh giá tổng quan</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-center">
                  <p className="text-5xl font-extrabold text-slate-900">{restaurant.rating}</p>
                  <div className="mt-1 flex gap-0.5 justify-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(restaurant.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{restaurant.reviews} đánh giá</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = restaurant.reviewsList.filter(r => Math.round(r.rating) === star).length;
                    const percentage = restaurant.reviews > 0 ? (count / restaurant.reviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-slate-400">{star}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                    Tiêu chí được chọn
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Người dùng nói gì
                  </h2>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  {reviewTestOptions.reduce((total, option) => total + option.clickCount, 0)} lượt chọn
                </div>
              </div>

              {reviewTestOptions.length === 0 ? (
                <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Chưa có dữ liệu tiêu chí.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {visibleReviewStatsOptions.map((option) => {
                    const maxClickCount = Math.max(
                      1,
                      ...reviewTestOptions.map((item) => item.clickCount),
                    );
                    const width = Math.min(
                      100,
                      (option.clickCount / maxClickCount) * 100,
                    );

                    return (
                      <div
                        key={option.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">
                            {option.label}
                          </p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                            <Users className="h-3.5 w-3.5" />
                            {option.clickCount}
                          </span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {reviewTestOptions.length > visibleReviewStatsCount && (
                    <button
                      type="button"
                      onClick={() => setShowAllReviewStats((current) => !current)}
                      className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                    >
                      {showAllReviewStats
                        ? "Thu gọn"
                        : `Xem thêm ${reviewTestOptions.length - visibleReviewStatsCount}`}
                    </button>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">
              {reportTarget?.type === "REVIEW" ? "Báo cáo đánh giá" : "Báo cáo nhà hàng"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {reportTarget?.type === "REVIEW"
                ? "Vui lòng cho chúng tôi biết vấn đề của đánh giá này."
                : "Vui lòng cho chúng tôi biết vấn đề của nhà hàng này."}
            </p>
            
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Lý do báo cáo *</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition"
                >
                  <option value="">Chọn lý do...</option>
                  {reportTarget?.type === "REVIEW" ? (
                    <>
                      <option value="Nội dung thô tục, xúc phạm">Nội dung thô tục, xúc phạm</option>
                      <option value="Spam / Quảng cáo">Spam / Quảng cáo</option>
                      <option value="Thông tin sai sự thật">Thông tin sai sự thật</option>
                      <option value="Khác">Khác</option>
                    </>
                  ) : (
                    <>
                      <option value="Thông tin không chính xác">Thông tin không chính xác</option>
                      <option value="Nhà hàng đã đóng cửa">Nhà hàng đã đóng cửa</option>
                      <option value="Không phải nhà hàng chay">Không phải nhà hàng chay</option>
                      <option value="Nội dung không phù hợp">Nội dung không phù hợp</option>
                      <option value="Khác">Khác</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Mô tả thêm</label>
                <textarea
                  rows={3}
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Cung cấp thêm chi tiết để chúng tôi xử lý nhanh hơn..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 transition"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
              <Button
                onClick={handleSubmitReport}
                disabled={isSubmittingReport || !reportReason}
                className="rounded-2xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {isSubmittingReport ? "Đang gửi..." : "Gửi báo cáo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
