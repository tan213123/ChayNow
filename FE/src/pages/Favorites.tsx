import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Heart, Leaf, MapPin, Phone, Search, Sprout } from "lucide-react";
import { getFavourites, removeFavourite } from "@/services/favourite.service";
import type { RestaurantResponse } from "@/types/restaurant";

const sortOptions = ["Mới nhất", "Đánh giá cao nhất", "Tên A-Z"];

export default function Favorites() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Mới nhất");
  const [removed, setRemoved] = useState<number[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<RestaurantResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavourites(0, 50)
      .then((res) => {
        if (res.success && res.data) {
          const restaurants = res.data.content.map((item) => item.restaurant);
          setAllRestaurants(restaurants);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80";

  const handleRemove = async (id: number) => {
    try {
      const res = await removeFavourite(id);
      if (res.success) {
        setRemoved((prev) => [...prev, id]);
      }
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  const displayed = allRestaurants
    .filter((r) => !removed.includes(r.id))
    .filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.address ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Tên A-Z") return a.name.localeCompare(b.name);
      return 0;
    });

  // Gợi ý: những nhà hàng đã bị xóa khỏi danh sách hiển thị
  const suggested = allRestaurants.filter((r) => removed.includes(r.id));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-500 to-teal-600 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              <Heart className="mr-2 inline h-4 w-4 fill-current" /> Danh sách yêu thích
            </span>
            <h1 className="mt-3 text-4xl font-extrabold text-white">
              Địa điểm bạn đã lưu
            </h1>
            <p className="mt-3 text-white/85 text-sm leading-relaxed">
              Những quán chay bạn yêu thích, luôn sẵn sàng để ghé thăm bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Controls */}
        <div className="-mt-6 mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm trong danh sách yêu thích..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 whitespace-nowrap">Sắp xếp:</span>
            <div className="flex gap-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    sortBy === opt
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {loading ? "Đang tải..." : `${displayed.length} địa điểm`}
          </span>
          {removed.length > 0 && (
            <button
              onClick={() => setRemoved([])}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition"
            >
              Khôi phục đã xoá ({removed.length})
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm animate-pulse">
                <div className="h-52 bg-slate-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                  <div className="h-3 w-1/2 rounded-full bg-slate-200" />
                  <div className="h-10 rounded-2xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((restaurant) => (
              <article
                key={restaurant.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={restaurant.mediaList[0]?.url ?? FALLBACK_IMG}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(restaurant.id)}
                    title="Xoá khỏi danh sách"
                    className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md text-sm transition hover:bg-red-600 hover:scale-110"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">{restaurant.name}</h2>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 shrink-0" /> {restaurant.address ?? "Chưa cập nhật"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {restaurant.typeRestaurantName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {restaurant.phoneNumber ?? "Chưa cập nhật"}</span>
                  </div>
                  <Link to={`/restaurant/${restaurant.id}?tab=menu`}>
                    <Button className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition">
                      Xem chi tiết →
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <Leaf className="mx-auto h-14 w-14 text-slate-300" />
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              {search ? "Không có kết quả phù hợp" : "Chưa có địa điểm yêu thích"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Thử tìm kiếm với từ khoá khác"
                : "Hãy khám phá và lưu những quán chay bạn yêu thích"}
            </p>
            <Link to="/">
              <Button className="mt-6 rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                <Sprout className="mr-2 h-4 w-4" /> Khám phá ngay
              </Button>
            </Link>
          </div>
        )}

        {/* Suggestions — nhà hàng đã tạm xóa */}
        {suggested.length > 0 && (
          <div className="mt-14">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Đã xoá gần đây</h2>
              <p className="mt-1 text-sm text-slate-500">Những nhà hàng bạn vừa xóa khỏi danh sách</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suggested.map((restaurant) => (
                <article
                  key={restaurant.id}
                  className="group overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={restaurant.mediaList[0]?.url ?? FALLBACK_IMG}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-90"
                    />
                  </div>
                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="font-bold text-slate-900">{restaurant.name}</h3>
                      <p className="mt-0.5 text-sm text-slate-500">{restaurant.address ?? "Chưa cập nhật"}</p>
                    </div>
                    <Link to={`/restaurant/${restaurant.id}?tab=menu`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-2xl border-slate-300 py-2.5 text-sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
