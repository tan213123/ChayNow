import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { restaurants, popularDishes, events, communityPosts } from "@/data/restaurants";

const tabs = ["Địa điểm ăn chay", "Món ăn nổi bật", "Sự kiện", "Bài đăng cộng đồng"] as const;
type Tab = (typeof tabs)[number];

const categoryFilters = ["Tất cả", "Cao Cấp", "Bình Dân", "Từ Thiện"];
const postCategories = ["Bình Dân", "Cao Cấp", "Gia Đình", "Vỉa Hè", "Chay Nhanh", "Quán Nhỏ"];

type CommunityPost = {
  id: string;
  restaurantName: string;
  location: string;
  description: string;
  category: string;
  priceRange: string;
  hours: string;
  tags: string[];
  postedBy: string;
  postedAt: string;
  likes: number;
  avatar: string;
};

const defaultForm = {
  restaurantName: "",
  location: "",
  description: "",
  category: "Bình Dân",
  priceRange: "",
  hours: "",
  tags: "",
};

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // Community posts state
  const [posts, setPosts] = useState<CommunityPost[]>(communityPosts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const filteredRestaurants = restaurants.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "Tất cả" || r.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleFormChange = (key: keyof typeof defaultForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitPost = () => {
    if (!form.restaurantName.trim() || !form.location.trim() || !form.description.trim()) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      restaurantName: form.restaurantName,
      location: form.location,
      description: form.description,
      category: form.category,
      priceRange: form.priceRange || "Chưa cập nhật",
      hours: form.hours || "Chưa cập nhật",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      postedBy: "Bạn",
      postedAt: "Vừa xong",
      likes: 0,
      avatar: "BN",
    };
    setPosts((prev) => [newPost, ...prev]);
    setForm(defaultForm);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: likedPosts.includes(postId) ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };



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
                      <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
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
            <article key={dish.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img src={dish.image} alt={dish.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
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

    if (selectedTab === "Sự kiện") {
      return (
        <div className="grid gap-6 lg:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-sm">{event.badge}</span>
                <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${event.status === "Đang diễn ra" ? "bg-emerald-600" : "bg-amber-500"}`}>
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
    }

    // ── COMMUNITY POSTS TAB ──────────────────────────────────────────
    return (
      <div className="space-y-6">
        {/* Success toast */}
        {submitted && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm animate-pulse">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Đăng bài thành công!</p>
              <p className="text-xs text-emerald-600">Cảm ơn bạn đã đóng góp cho cộng đồng ChayNow!</p>
            </div>
          </div>
        )}

        {/* Header row */}
        <div>
          <p className="text-sm text-slate-500">
            Chia sẻ những quán chay bạn biết nhưng chưa có trên ChayNow. Giúp cộng đồng khám phá thêm!
          </p>
        </div>

        {/* Submit Form */}
        {showForm ? (
          <div className="rounded-[2rem] border-2 border-violet-200 bg-violet-50/50 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-600 text-white text-lg">📝</div>
                <p className="font-bold text-slate-900">Đăng quán chay mới</p>
              </div>
              <button onClick={() => { setShowForm(false); setForm(defaultForm); }} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tên quán <span className="text-red-500">*</span></label>
                <input
                  value={form.restaurantName}
                  onChange={(e) => handleFormChange("restaurantName", e.target.value)}
                  placeholder="VD: Quán Chay Bà Ba"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Địa chỉ <span className="text-red-500">*</span></label>
                <input
                  value={form.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  placeholder="VD: 12 Nguyễn Huệ, Quận 1"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Loại hình</label>
                <select
                  value={form.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
                >
                  {postCategories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Khoảng giá</label>
                <input
                  value={form.priceRange}
                  onChange={(e) => handleFormChange("priceRange", e.target.value)}
                  placeholder="VD: 30.000đ - 80.000đ"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Giờ mở cửa</label>
                <input
                  value={form.hours}
                  onChange={(e) => handleFormChange("hours", e.target.value)}
                  placeholder="VD: 07:00 - 21:00"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tags (phân cách bằng dấu phẩy)</label>
                <input
                  value={form.tags}
                  onChange={(e) => handleFormChange("tags", e.target.value)}
                  placeholder="VD: Cơm chay, Bún, Healthy"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mô tả trải nghiệm <span className="text-red-500">*</span></label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Chia sẻ về quán: món ngon, không gian, giá cả, cảm nhận của bạn..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition"
              />
              <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/500</p>
            </div>

            <div className="flex items-center justify-between border-t border-violet-100 pt-4">
              <p className="text-xs text-slate-400">Bài đăng sẽ hiển thị ngay và chờ cộng đồng xác nhận.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowForm(false); setForm(defaultForm); }}
                  className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Huỷ
                </button>
                <Button
                  onClick={handleSubmitPost}
                  disabled={!form.restaurantName.trim() || !form.location.trim() || !form.description.trim()}
                  className="rounded-2xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition"
                >
                  📤 Đăng bài
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="group flex w-full items-center gap-4 rounded-[2rem] border-2 border-dashed border-violet-300 bg-violet-50/50 px-6 py-5 text-left transition hover:border-violet-500 hover:bg-violet-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white text-xl shadow-md group-hover:scale-110 transition-transform">
              ✏️
            </div>
            <div>
              <p className="font-bold text-slate-900">Bạn biết quán chay nào chưa có trên ChayNow?</p>
              <p className="mt-0.5 text-sm text-slate-500">Chia sẻ để giúp cộng đồng khám phá thêm → Nhấn để đăng bài</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-sm group-hover:bg-violet-700 transition">
              + Đăng ngay
            </span>
          </button>
        )}

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl">🌿</p>
            <p className="mt-3 text-slate-500">Chưa có bài đăng nào</p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Post header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                      {post.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{post.postedBy}</p>
                      <p className="text-xs text-slate-400">{post.postedAt}</p>
                    </div>
                  </div>
                </div>

                {/* Restaurant info */}
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{post.restaurantName}</h3>
                    <span className="shrink-0 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      {post.category}
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-slate-500">
                    <span>📍</span> {post.location}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    {post.hours !== "Chưa cập nhật" && (
                      <span className="flex items-center gap-1"><span>🕐</span> {post.hours}</span>
                    )}
                    {post.priceRange !== "Chưa cập nhật" && (
                      <span className="flex items-center gap-1"><span>💰</span> {post.priceRange}</span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                  "{post.description}"
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer actions */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                      likedPosts.includes(post.id)
                        ? "bg-red-50 text-red-500"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <span>{likedPosts.includes(post.id) ? "♥" : "♡"}</span>
                    <span>{post.likes}</span>
                    <span className="text-xs">Hữu ích</span>
                  </button>
                  <div className="flex gap-2">
                    <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                      💬 Bình luận
                    </button>
                    <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                      📤 Chia sẻ
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  };

  const counts = {
    "Địa điểm ăn chay": filteredRestaurants.length,
    "Món ăn nổi bật": popularDishes.length,
    "Sự kiện": events.length,
    "Bài đăng cộng đồng": posts.length,
  };

  const tabIcons: Record<Tab, string> = {
    "Địa điểm ăn chay": "🏠",
    "Món ăn nổi bật": "🍽️",
    "Sự kiện": "🎉",
    "Bài đăng cộng đồng": "✏️",
  };

  const countLabels: Record<Tab, string> = {
    "Địa điểm ăn chay": "địa điểm",
    "Món ăn nổi bật": "món ăn",
    "Sự kiện": "sự kiện",
    "Bài đăng cộng đồng": "bài đăng",
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-500 to-teal-600 px-6 py-20">
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
                      ? tab === "Bài đăng cộng đồng"
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tabIcons[tab]}
                  {tab}
                  {tab === "Bài đăng cộng đồng" && (
                    <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${selectedTab === tab ? "bg-white/25 text-white" : "bg-violet-100 text-violet-700"}`}>
                      {posts.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedTab === "Bài đăng cộng đồng" ? "bg-violet-50 text-violet-700" : "bg-emerald-50 text-emerald-700"}`}>
                {counts[selectedTab]} {countLabels[selectedTab]}
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
