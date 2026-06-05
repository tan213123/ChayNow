import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { favoriteRestaurants } from "@/data/restaurants";

type AuthUser = {
  email: string;
  label: string;
};

const activityLog = [
  { id: 1, type: "review", text: "Đã đánh giá Hum Vegetarian ★★★★★", time: "2 giờ trước", icon: "⭐" },
  { id: 2, type: "favorite", text: "Đã lưu Loving Hut vào yêu thích", time: "1 ngày trước", icon: "♥" },
  { id: 3, type: "visit", text: "Đã ghé thăm An Lạc Chay", time: "3 ngày trước", icon: "📍" },
  { id: 4, type: "review", text: "Đã đánh giá Loving Hut ★★★★", time: "1 tuần trước", icon: "⭐" },
  { id: 5, type: "favorite", text: "Đã lưu Hum Vegetarian vào yêu thích", time: "2 tuần trước", icon: "♥" },
];

const achievements = [
  { id: 1, icon: "🌱", title: "Người mới", desc: "Đã tham gia cộng đồng chay", unlocked: true },
  { id: 2, icon: "⭐", title: "Nhà phê bình", desc: "Đã viết 5 đánh giá", unlocked: true },
  { id: 3, icon: "♥", title: "Tín đồ chay", desc: "Đã lưu 10 địa điểm yêu thích", unlocked: false },
  { id: 4, icon: "🏆", title: "Chuyên gia", desc: "Đã thử 20 nhà hàng chay", unlocked: false },
];

export default function Profile() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "favorites" | "activity" | "settings">("overview");
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("Nguyễn Văn A");
  const [bio, setBio] = useState("Yêu thích ẩm thực chay, tìm kiếm những quán ngon tại TPHCM 🌱");
  const [phone, setPhone] = useState("0901 234 567");

  useEffect(() => {
    const authData = localStorage.getItem("authUser");
    if (!authData) {
      navigate("/login");
      return;
    }
    try {
      setAuthUser(JSON.parse(authData));
    } catch {
      localStorage.removeItem("authUser");
      navigate("/login");
    }
  }, [navigate]);

  if (!authUser) return null;

  const getInitials = (email: string) => email.slice(0, 2).toUpperCase();

  const tabItems = [
    { id: "overview" as const, label: "Tổng quan", icon: "📊" },
    { id: "favorites" as const, label: "Yêu thích", icon: "♥" },
    { id: "activity" as const, label: "Hoạt động", icon: "📋" },
    { id: "settings" as const, label: "Cài đặt", icon: "⚙️" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Profile Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 pb-24 pt-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">
            {/* Avatar */}
            <div className="relative">
              <div className="h-28 w-28 rounded-[2rem] bg-white/20 ring-4 ring-white/40 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                {getInitials(authUser.email)}
              </div>
              <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-lg hover:bg-slate-100 transition">
                📷
              </button>
            </div>

            <div className="flex-1">
              <div className="flex flex-col items-center gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-emerald-100">
                    {authUser.label}
                  </p>
                  <h1 className="mt-1 text-3xl font-extrabold text-white">{name}</h1>
                  <p className="mt-2 text-sm text-emerald-100/90">{bio}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    {editMode ? "Huỷ" : "Chỉnh sửa hồ sơ"}
                  </button>
                  {authUser.label === "Chủ quán" && (
                    <Link
                      to="/manage"
                      className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
                    >
                      Quản lý quán
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Địa điểm đã ghé", value: "12" },
              { label: "Đánh giá đã viết", value: "8" },
              { label: "Yêu thích", value: String(favoriteRestaurants.length) },
              { label: "Điểm cộng đồng", value: "340" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] bg-white/10 p-4 text-center backdrop-blur-sm">
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-emerald-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="-mt-8 rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 border-b border-slate-100 p-2">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Thông tin cá nhân</h2>
                    <div className="space-y-3 rounded-[1.5rem] bg-slate-50 p-5">
                      {[
                        { label: "Email", value: authUser.email, icon: "📧" },
                        { label: "Số điện thoại", value: phone, icon: "📱" },
                        { label: "Loại tài khoản", value: authUser.label, icon: "👤" },
                        { label: "Tham gia từ", value: "Tháng 5/2026", icon: "📅" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="text-sm font-medium text-slate-900">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Thành tích</h2>
                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map((a) => (
                        <div
                          key={a.id}
                          className={`rounded-[1.5rem] border p-4 text-center transition ${
                            a.unlocked
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-slate-200 bg-slate-50 opacity-50"
                          }`}
                        >
                          <div className="text-3xl">{a.icon}</div>
                          <p className={`mt-2 text-sm font-semibold ${a.unlocked ? "text-emerald-800" : "text-slate-500"}`}>
                            {a.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{a.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent activity preview */}
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Hoạt động gần đây</h2>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className="text-sm font-medium text-emerald-600 hover:underline"
                    >
                      Xem tất cả →
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {activityLog.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{item.text}</p>
                          <p className="text-xs text-slate-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">Địa điểm yêu thích</h2>
                  <Link to="/favorites" className="text-sm font-medium text-emerald-600 hover:underline">
                    Xem trang yêu thích →
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {favoriteRestaurants.map((r) => (
                    <Link key={r.id} to={`/restaurant/${r.id}`}>
                      <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                        <div className="relative h-44 overflow-hidden bg-slate-100">
                          <img
                            src={r.image}
                            alt={r.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm">
                            {r.rating} ★
                          </div>
                          <button className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-sm text-sm">
                            ♥
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-slate-900">{r.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{r.location}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {r.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
                {favoriteRestaurants.length === 0 && (
                  <div className="py-20 text-center">
                    <p className="text-4xl">🍃</p>
                    <p className="mt-4 text-slate-500">Chưa có địa điểm yêu thích nào</p>
                    <Link to="/" className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:underline">
                      Khám phá ngay →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Lịch sử hoạt động</h2>
                <div className="relative space-y-4 pl-6">
                  {/* Timeline line */}
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-200" />
                  {activityLog.map((item) => (
                    <div key={item.id} className="relative flex items-start gap-4">
                      <div className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-emerald-200 text-base shadow-sm">
                        {item.icon}
                      </div>
                      <div className="ml-6 flex-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <p className="text-sm font-medium text-slate-900">{item.text}</p>
                        <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-900">Cài đặt tài khoản</h2>

                {/* Edit Profile */}
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <p className="font-semibold text-slate-900">Thông tin cá nhân</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Họ và tên</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Số điện thoại</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Giới thiệu bản thân</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition resize-none"
                    />
                  </div>
                  <Button className="rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                    Lưu thay đổi
                  </Button>
                </div>

                {/* Change Password */}
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <p className="font-semibold text-slate-900">Đổi mật khẩu</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-2xl border-slate-300 px-6 py-2.5 text-sm font-semibold">
                    Cập nhật mật khẩu
                  </Button>
                </div>

                {/* Notifications */}
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <p className="font-semibold text-slate-900">Thông báo</p>
                  <div className="space-y-3">
                    {[
                      { label: "Thông báo đánh giá mới", desc: "Nhận thông báo khi có người đánh giá địa điểm yêu thích" },
                      { label: "Sự kiện gần đây", desc: "Nhận thông báo về sự kiện và khuyến mãi" },
                      { label: "Gợi ý quán mới", desc: "Nhận gợi ý về các quán chay mới được thêm vào" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" defaultChecked={idx === 0} className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-emerald-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-full" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="rounded-[1.5rem] border border-red-100 bg-red-50 p-6 space-y-3">
                  <p className="font-semibold text-red-800">Vùng nguy hiểm</p>
                  <p className="text-sm text-red-600">Các thao tác này không thể hoàn tác.</p>
                  <Button
                    variant="outline"
                    className="rounded-2xl border-red-300 text-red-700 hover:bg-red-100 px-6 py-2.5 text-sm font-semibold"
                  >
                    Xoá tài khoản
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-16" />
    </main>
  );
}
