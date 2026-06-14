import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import OwnerLayout from "@/components/OwnerLayout";
import {
  getRestaurant,
  getRestaurantReviews,
  getRestaurants,
} from "@/services/restaurant.service";
import {
  getSelectedRestaurantId,
  setSelectedRestaurantId,
} from "@/lib/ownerRestaurant";
import type {
  RestaurantResponse,
  ReviewResponse,
} from "@/types/restaurant";

const fallbackImage =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80";

export default function OwnerDashboard() {
  const [restaurant, setRestaurant] = useState<RestaurantResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      let restaurantId = getSelectedRestaurantId();

      if (!restaurantId) {
        const restaurants = await getRestaurants();
        restaurantId = restaurants[0]?.id ?? null;
        if (restaurantId) {
          setSelectedRestaurantId(restaurantId);
        }
      }

      if (!restaurantId) {
        return;
      }

      const [restaurantData, reviewData] = await Promise.all([
        getRestaurant(restaurantId),
        getRestaurantReviews(restaurantId),
      ]);

      if (!cancelled) {
        setRestaurant(restaurantData);
        setReviews(reviewData);
      }
    };

    loadDashboard()
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể tải dashboard.",
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
  }, []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }
    return (
      reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length
    );
  }, [reviews]);

  if (isLoading) {
    return (
      <OwnerLayout>
        <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-500">
          Đang tải dashboard...
        </div>
      </OwnerLayout>
    );
  }

  if (!restaurant) {
    return (
      <OwnerLayout>
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Chưa có nhà hàng để quản lý
          </h1>
          <Link
            to="/manage/edit"
            className="mt-6 inline-flex rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Tạo nhà hàng
          </Link>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Dashboard chủ quán
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
              {restaurant.name}
            </h1>
          </div>
          <Link
            to="/manage/restaurants"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Đổi nhà hàng
          </Link>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <img
                src={restaurant.mediaList[0]?.url ?? fallbackImage}
                alt={restaurant.name}
                className="h-28 w-28 rounded-[2rem] object-cover"
              />
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {restaurant.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {restaurant.address || "Chưa cập nhật địa chỉ"}
                </p>
                {restaurant.openTime && restaurant.closedTime ? (
                  <p className="mt-2 text-sm text-slate-500">
                    Mở cửa {restaurant.openTime.slice(0, 5)} -{" "}
                    {restaurant.closedTime.slice(0, 5)}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
                    {restaurant.typeRestaurantName}
                  </span>
                  {restaurant.placeName ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                      {restaurant.placeName}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <Link
              to={`/manage/edit?id=${restaurant.id}`}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Chỉnh sửa
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Đánh giá trung bình
            </p>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {averageRating.toFixed(1)}
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Tổng đánh giá
            </p>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {reviews.length}
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">
              Đánh giá tích cực
            </p>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {reviews.filter((review) => review.rating >= 4).length}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/manage/reviews"
            className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-7"
          >
            <h2 className="text-lg font-semibold text-emerald-900">
              Xem đánh giá
            </h2>
            <p className="mt-2 text-sm leading-6 text-emerald-700">
              Dữ liệu đánh giá được lấy trực tiếp theo nhà hàng đang chọn.
            </p>
          </Link>
          <Link
            to="/manage/new-dish"
            className="rounded-[2rem] border border-amber-200 bg-amber-50 p-7"
          >
            <h2 className="text-lg font-semibold text-amber-900">
              Quản lý thực đơn
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-700">
              Tạo, chỉnh sửa và ngừng hiển thị món ăn của nhà hàng đang chọn.
            </p>
          </Link>
        </div>
      </div>
    </OwnerLayout>
  );
}
