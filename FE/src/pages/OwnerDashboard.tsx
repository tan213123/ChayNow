import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/OwnerLayout";
import { restaurants } from "@/data/restaurants";

const defaultRestaurant = restaurants[0];

type OwnerRestaurant = typeof defaultRestaurant;
type OwnerEvent = {
  id: string;
  type: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  discount?: string;
  charityTime?: string;
  createdAt: string;
};

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [ownerRestaurant] = useState<OwnerRestaurant>(() => {
    const storedRestaurant = localStorage.getItem("ownerRestaurant");
    if (!storedRestaurant) {
      return defaultRestaurant;
    }

    try {
      return JSON.parse(storedRestaurant);
    } catch {
      localStorage.removeItem("ownerRestaurant");
      return defaultRestaurant;
    }
  });
  const [ownerEvents] = useState<OwnerEvent[]>(() => {
    const storedEvents = localStorage.getItem("ownerEvents");
    if (!storedEvents) {
      return [];
    }

    try {
      return JSON.parse(storedEvents);
    } catch {
      localStorage.removeItem("ownerEvents");
      return [];
    }
  });
  const [dashboardView, setDashboardView] = useState<"menu" | "events">("menu");
  const [selectedEvent, setSelectedEvent] = useState<OwnerEvent | null>(null);
  useEffect(() => {
    const storedRestaurant = localStorage.getItem("ownerRestaurant");
    if (!storedRestaurant) {
      navigate("/manage/restaurants");
    }
  }, [navigate]);
  const handleEditEvent = (event: OwnerEvent) => {
    localStorage.setItem("editingEvent", JSON.stringify(event));
    navigate("/manage/events");
  };

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
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-7">
            <h2 className="text-lg font-semibold text-amber-900">
              Menu và sự kiện
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-700">
              Swagger hiện chưa cung cấp API menu, bài đăng hoặc sự kiện nên FE
              không gửi dữ liệu giả cho các chức năng này.
            </p>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
