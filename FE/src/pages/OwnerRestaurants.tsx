import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OwnerLayout from "@/components/OwnerLayout";
import { restaurants } from "@/data/restaurants";

export default function OwnerRestaurants() {
  const navigate = useNavigate();
  const restaurantList = restaurants;
  const handleEdit = (restaurant: typeof restaurants[number]) => {
    localStorage.setItem("ownerRestaurant", JSON.stringify(restaurant));
    navigate("/manage/edit");
  };

  const handleSelectRestaurant = (restaurant: typeof restaurants[number]) => {
    localStorage.setItem("ownerRestaurant", JSON.stringify(restaurant));
    navigate("/manage");
  };

  return (
    <OwnerLayout>
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-6 rounded-[2rem] bg-white p-10 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Nhà hàng của tôi</p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Quản lý danh sách quán</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Xem toàn bộ quán bạn đang quản lý, chỉnh sửa thông tin hoặc đăng quán mới.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                localStorage.removeItem("ownerRestaurant");
                navigate("/manage/edit");
              }}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Thêm quán mới
            </Button>
            <Link
              to="/manage"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Quay lại Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {restaurantList.map((restaurant) => (
            <article
              key={restaurant.id}
              onClick={() => handleSelectRestaurant(restaurant)}
              role="button"
              tabIndex={0}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{restaurant.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{restaurant.location}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {restaurant.category}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
                  <span>{restaurant.hours}</span>
                  <span>{restaurant.priceRange}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {restaurant.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 text-sm text-slate-600">
                  <p>{restaurant.rating} ★</p>
                  <p>{restaurant.reviews} nhận xét</p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleEdit(restaurant);
                  }}
                  className="mt-6 w-full rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Chỉnh sửa quán
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </OwnerLayout>
  );
}
