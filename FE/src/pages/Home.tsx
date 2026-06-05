import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { restaurants, popularDishes, events } from "@/data/restaurants";

const tabs = ["Địa điểm ăn chay", "Món ăn nổi bật", "Sự kiện"] as const;
type Tab = (typeof tabs)[number];

const categoryFilters = ["Tất cả", "Cao Cấp", "Bình Dân", "Từ Thiện"];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredRestaurants = restaurants.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "Tất cả" || r.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const renderCards = () => {
    if (selectedTab === "Địa điểm ăn chay") {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.length === 0 ? (
            <div className="col-span-3 py-20 text-center">
              <p className="text-4xl">🔍</p>
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
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-sm font-bold text-amber-600 shadow-md backdrop-blur-sm">
                    {item.rating} ★
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <span>📍</span> {item.location}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><span>🕐</span> {item.hours}</span>
                    <span>{item.reviews} đánh giá</span>
                  </div>
                  <Link to={`/restaurant/${item.id}`}>
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
      return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularDishes.map((dish) => (
            <article
              key={dish.id}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-amber-600 backdrop-blur-sm">
                  {dish.likes} ♥
                </span>
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">{dish.type}</p>
                <h3 className="font-bold text-slate-900 leading-snug">{dish.name}</h3>
                <p className="text-sm text-slate-500">{dish.restaurant}</p>
                <p className="text-xs text-slate-400">{dish.date}</p>
              </div>
            </article>
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {events.map((event) => (
          <article
            key={event.id}
            className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                {event.badge}
              </span>
              <span
                className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
                  event.status === "Đang diễn ra" ? "bg-emerald-600" : "bg-amber-500"
                }`}
              >
                {event.status}
              </span>
            </div>
            <div className="space-y-3 p-6">
              <h3 className="font-bold text-slate-900">{event.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{event.description}</p>
              <div className="border-t border-slate-100 pt-3 space-y-1 text-xs text-slate-400">
                <p className="flex items-center gap-1.5"><span>📍</span> {event.venue}</p>
                <p className="flex items-center gap-1.5"><span>📅</span> {event.duration}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  };

  const counts = {
    "Địa điểm ăn chay": filteredRestaurants.length,
    "Món ăn nổi bật": popularDishes.length,
    "Sự kiện": events.length,
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-500 to-teal-600 px-6 py-20">
        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-60 w-60 rounded-full bg-emerald-800/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-5">
            <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              🌱 Cộng đồng ẩm thực chay TPHCM
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
              <Button className="min-w-[130px] rounded-3xl bg-slate-900 px-6 py-4 text-sm font-bold text-white hover:bg-slate-800 shadow-lg transition">
                🔍 Tìm kiếm
              </Button>
            </div>
            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { label: "Nhà hàng", value: "100+" },
                { label: "Món ăn", value: "500+" },
                { label: "Đánh giá", value: "2.000+" },
              ].map((s) => (
                <div key={s.label} className="text-white">
                  <span className="text-2xl font-extrabold">{s.value}</span>
                  <span className="ml-1.5 text-sm text-white/70">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Category Filter (only for restaurants tab) */}
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
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    selectedTab === tab
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab === "Địa điểm ăn chay" && "🏠"}
                  {tab === "Món ăn nổi bật" && "🍽️"}
                  {tab === "Sự kiện" && "🎉"}
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {counts[selectedTab]} {selectedTab === "Địa điểm ăn chay" ? "địa điểm" : selectedTab === "Món ăn nổi bật" ? "món ăn" : "sự kiện"}
              </div>
            </div>
          </div>

          <div className="mt-8">{renderCards()}</div>
        </div>

        {/* Features Banner */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🌿", title: "100% Thuần chay", desc: "Tất cả địa điểm đều được xác minh và cam kết thuần chay" },
            { icon: "⭐", title: "Đánh giá thực", desc: "Hàng nghìn đánh giá từ cộng đồng người dùng thực tế" },
            { icon: "📍", title: "Khắp TPHCM", desc: "Từ quận 1 đến vùng ngoại ô, chúng tôi có mặt ở mọi nơi" },
          ].map((f) => (
            <div key={f.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm text-center">
              <div className="text-4xl">{f.icon}</div>
              <h3 className="mt-3 font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
