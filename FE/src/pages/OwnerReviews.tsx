import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/OwnerLayout";
import {
  getRestaurant,
  getRestaurantReviews,
  getReview,
} from "@/services/restaurant.service";
import { getSelectedRestaurantId } from "@/lib/ownerRestaurant";
import type {
  RestaurantResponse,
  ReviewResponse,
} from "@/types/restaurant";

export default function OwnerReviews() {
  const restaurantId = getSelectedRestaurantId();
  const [restaurant, setRestaurant] = useState<RestaurantResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(Boolean(restaurantId));

  useEffect(() => {
    if (!restaurantId) {
      return;
    }

    let cancelled = false;
    Promise.all([
      getRestaurant(restaurantId),
      getRestaurantReviews(restaurantId),
    ])
      .then(([restaurantData, reviewData]) => {
        if (!cancelled) {
          setRestaurant(restaurantData);
          setReviews(reviewData);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể tải đánh giá.",
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
  }, [restaurantId]);

  const average = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }
    return (
      reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length
    );
  }, [reviews]);

  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((review) => review.rating === star).length,
      })),
    [reviews],
  );

  const handleOpenReview = async (reviewId: number) => {
    try {
      setSelectedReview(await getReview(reviewId));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tải chi tiết đánh giá.",
      );
    }
  };

  if (!restaurantId) {
    return (
      <OwnerLayout>
        <div className="rounded-[2rem] bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Chưa chọn nhà hàng
          </h1>
          <Link
            to="/manage/restaurants"
            className="mt-5 inline-flex rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Chọn nhà hàng
          </Link>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Đánh giá khách hàng
          </p>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                {restaurant?.name ?? "Nhà hàng"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Backend hiện chưa có API phản hồi đánh giá, vì vậy màn hình này
                chỉ hiển thị dữ liệu thật.
              </p>
            </div>
            <Link
              to="/manage"
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Quay lại dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Điểm trung bình</p>
            <p className="mt-4 text-4xl font-extrabold text-slate-900">
              {average.toFixed(1)}
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Tổng đánh giá</p>
            <p className="mt-4 text-4xl font-extrabold text-slate-900">
              {reviews.length}
            </p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Tích cực</p>
            <p className="mt-4 text-4xl font-extrabold text-slate-900">
              {reviews.filter((review) => review.rating >= 4).length}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-7 shadow-sm">
          <h2 className="font-semibold text-slate-900">Phân bố đánh giá</h2>
          <div className="mt-5 space-y-3">
            {distribution.map((item) => {
              const width =
                reviews.length === 0 ? 0 : (item.count / reviews.length) * 100;
              return (
                <div key={item.star} className="flex items-center gap-4 text-sm">
                  <span className="w-10 font-medium text-slate-700">
                    {item.star} ★
                  </span>
                  <div className="h-3 flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-semibold text-slate-700">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-7 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Tất cả đánh giá
          </h2>
          {isLoading ? (
            <p className="mt-6 text-sm text-slate-500">Đang tải đánh giá...</p>
          ) : reviews.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
              Nhà hàng chưa có đánh giá.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        Người dùng #{review.userId}
                      </p>
                      <p className="mt-1 text-amber-500">
                        {Array.from({ length: 5 }, (_, index) =>
                          index < review.rating ? "★" : "☆",
                        ).join("")}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleOpenReview(review.id)}
                      className="rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    >
                      Chi tiết
                    </Button>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {review.context}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedReview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl">
            <p className="text-sm font-semibold text-emerald-700">
              Đánh giá #{selectedReview.id}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {selectedReview.restaurantName}
            </h2>
            <p className="mt-4 text-amber-500">
              {Array.from({ length: 5 }, (_, index) =>
                index < selectedReview.rating ? "★" : "☆",
              ).join("")}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {selectedReview.context}
            </p>
            <Button
              onClick={() => setSelectedReview(null)}
              className="mt-6 rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
            >
              Đóng
            </Button>
          </div>
        </div>
      ) : null}
    </OwnerLayout>
  );
}
