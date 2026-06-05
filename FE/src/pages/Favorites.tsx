import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { favoriteRestaurants, restaurants } from "@/data/restaurants";

const sortOptions = ["Mới nhất", "Đánh giá cao nhất", "Tên A-Z"];

export default function Favorites() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Mới nhất");
  const [removed, setRemoved] = useState<string[]>([]);

  const handleRemove = (id: string) => {
    setRemoved((prev) => [...prev, id]);
  };

  const displayed = favoriteRestaurants
    .filter((r) => !removed.includes(r.id))
    .filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Đánh giá cao nhất") return b.rating - a.rating;
      if (sortBy === "Tên A-Z") return a.name.localeCompare(b.name);
      return 0;
    });

  // Suggested restaurants (not in favorites)
  const suggested = restaurants.filter((r) => !favoriteRestaurants.find((f) => f.id === r.id));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-500 to-teal-600 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              ♥ Danh sách yêu thích
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
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Tìm trong danh sách yêu thích..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
          />
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
            {displayed.length} địa điểm yêu thích
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
        {displayed.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((restaurant) => (
              <article
                key={restaurant.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-amber-600 shadow-md">
                    {restaurant.rating} ★
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(restaurant.id)}
                    title="Xoá khỏi yêu thích"
                    className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md text-sm transition hover:bg-red-600 hover:scale-110"
                  >
                    ♥
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">{restaurant.name}</h2>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <span>📍</span> {restaurant.location}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {restaurant.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {restaurant.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span>🕐 {restaurant.hours}</span>
                    <span>{restaurant.reviews} đánh giá</span>
                  </div>
                  <Link to={`/restaurant/${restaurant.id}`}>
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
            <div className="text-6xl">🍃</div>
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
                Khám phá ngay 🌱
              </Button>
            </Link>
          </div>
        )}

        {/* Suggestions */}
        {suggested.length > 0 && (
          <div className="mt-14">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Có thể bạn cũng thích</h2>
              <p className="mt-1 text-sm text-slate-500">Khám phá thêm những quán chay tuyệt vời khác</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suggested.map((restaurant) => (
                <article
                  key={restaurant.id}
                  className="group overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-90"
                    />
                    <div className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-600 shadow-sm">
                      {restaurant.rating} ★
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <div>
                      <h3 className="font-bold text-slate-900">{restaurant.name}</h3>
                      <p className="mt-0.5 text-sm text-slate-500">{restaurant.location}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Link to={`/restaurant/${restaurant.id}`} className="flex-1">
                        <Button variant="outline" className="w-full rounded-2xl border-slate-300 py-2.5 text-sm">
                          Xem chi tiết
                        </Button>
                      </Link>
                      <button className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition text-lg">
                        ♡
                      </button>
                    </div>
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
