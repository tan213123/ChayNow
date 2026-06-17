import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/OwnerLayout";
import {
  deleteRestaurant,
  getRestaurants,
  getReviews,
} from "@/services/restaurant.service";
import { setSelectedRestaurantId } from "@/lib/ownerRestaurant";
import type {
  RestaurantResponse,
  ReviewResponse,
} from "@/types/restaurant";

export default function OwnerRestaurants() {
  const navigate = useNavigate();
  const restaurantList = restaurants;
  const handleEdit = (restaurant: typeof restaurants[number]) => {
    localStorage.setItem("ownerRestaurant", JSON.stringify(restaurant));
    navigate("/manage/edit");
  };

  const handleDelete = async (restaurant: RestaurantResponse) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn ngừng hiển thị "${restaurant.name}" không?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(restaurant.id);
      await deleteRestaurant(restaurant.id);
      setRestaurants((current) =>
        current.filter((item) => item.id !== restaurant.id),
      );
      toast.success("Đã cập nhật trạng thái nhà hàng.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái nhà hàng.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <OwnerLayout>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-6 rounded-[2rem] bg-white p-10 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Nhà hàng
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
              Quản lý danh sách quán
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Dữ liệu được tải trực tiếp từ hệ thống. Backend hiện chưa có
              trường liên kết nhà hàng với tài khoản owner nên danh sách này
              gồm toàn bộ nhà hàng đang hoạt động.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate("/manage/edit")}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700"
            >
              Thêm quán mới
            </Button>
            <Link
              to="/manage"
              className="inline-flex items-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center text-sm text-slate-500">
            Đang tải danh sách nhà hàng...
          </div>
        ) : restaurants.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-slate-900">Chưa có nhà hàng.</p>
            <p className="mt-2 text-sm text-slate-500">
              Tạo địa điểm và nhà hàng đầu tiên từ nút phía trên.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {restaurants.map((restaurant) => {
              const stats = reviewStats.get(restaurant.id);
              return (
                <article
                  key={restaurant.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => selectRestaurant(restaurant.id, "/manage")}
                    className="block w-full text-left"
                  >
                    <img
                      src={restaurant.mediaList[0]?.url ?? fallbackImage}
                      alt={restaurant.name}
                      className="h-52 w-full object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">
                            {restaurant.name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            {restaurant.placeName ?? restaurant.address}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {restaurant.typeRestaurantName}
                        </span>
                      </div>
                      <div className="mt-5 flex justify-between text-sm text-slate-600">
                        <span>{stats?.average.toFixed(1) ?? "0.0"} ★</span>
                        <span>{stats?.count ?? 0} đánh giá</span>
                      </div>
                    </div>
                  </button>

                  <div className="flex gap-3 px-6 pb-6">
                    <Button
                      onClick={() =>
                        selectRestaurant(
                          restaurant.id,
                          `/manage/edit?id=${restaurant.id}`,
                        )
                      }
                      className="flex-1 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Chỉnh sửa
                    </Button>
                    <Button
                      onClick={() => handleDelete(restaurant)}
                      disabled={deletingId === restaurant.id}
                      className="rounded-2xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                    >
                      {deletingId === restaurant.id ? "Đang xóa..." : "Xóa"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </OwnerLayout>
  );
}
