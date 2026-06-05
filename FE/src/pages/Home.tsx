import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { restaurants, popularDishes, events } from "@/data/restaurants";

const tabs = ["Địa điểm ăn chay", "Món ăn nổi bật", "Sự kiện"] as const;
type Tab = (typeof tabs)[number];

type AuthUser = {
  email: string;
  label: string;
};

export default function Home() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const authData = localStorage.getItem("authUser");
    if (authData) {
      try {
        setAuthUser(JSON.parse(authData));
      } catch {
        localStorage.removeItem("authUser");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    setAuthUser(null);
    navigate("/login");
  };

  const renderCards = () => {
    if (selectedTab === "Địa điểm ăn chay") {
      return (
        <div className="grid gap-6 lg:grid-cols-3">
          {restaurants.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-60 overflow-hidden bg-slate-100">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm">
                  {item.rating} ★
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{item.location}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{item.category}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <p>{item.hours}</p>
                  <p>{item.reviews} đánh giá</p>
                </div>
                <Link to={`/restaurant/${item.id}`}>
                  <Button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      );
    }

    if (selectedTab === "Món ăn nổi bật") {
      return (
        <div className="grid gap-6 lg:grid-cols-4">
          {popularDishes.map((dish) => (
            <article key={dish.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img src={dish.image} alt={dish.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-600">{dish.type}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{dish.likes} ♥</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{dish.name}</h3>
                <p className="text-sm text-slate-500">{dish.restaurant}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <p>{dish.date}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      );
    }

    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {events.map((event) => (
          <article key={event.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-56 overflow-hidden bg-slate-100">
              <img src={event.image} alt={event.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">{event.badge}</span>
              <span className="absolute right-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">{event.status}</span>
            </div>
            <div className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
              <p className="text-sm text-slate-500">{event.description}</p>
              <div className="text-sm text-slate-500">
                <p>{event.venue}</p>
                <p>{event.duration}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  };

  const header = authUser ? (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 text-emerald-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl">🌱</div>
          <span className="font-semibold">Chay TPHCM</span>
        </div>
        <nav className="flex items-center gap-8 text-sm text-slate-600">
          <Link to="/" className="flex items-center gap-2 font-medium text-slate-900">
            <span>🏠</span> Trang chủ
          </Link>
          <Link to="/favorites" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
            <span>♥</span> Yêu thích
          </Link>
          {authUser?.label === "Chủ quán" ? (
            <Link to="/manage" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <span>🏪</span> Quản lý quán
            </Link>
          ) : null}
        </nav>
        <div className="flex items-center gap-4 text-sm text-slate-700">
          <span className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm">{authUser.label?.[0] ?? "U"}</span>
            {authUser.label}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-full bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  ) : (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 text-emerald-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl">🌱</div>
          <span className="font-semibold">Chay TPHCM</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Đăng nhập
          </Link>
          <Link to="/register" className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {header}

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-500 to-slate-900 px-8 py-14 text-white shadow-2xl">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl font-extrabold sm:text-5xl">Khám phá ẩm thực chay TPHCM 🌱</h1>
            <p className="max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
              Tìm kiếm những địa điểm ăn chay ngon, sạch và uy tín tại Sài Gòn.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Tìm kiếm quán ăn, địa chỉ..."
                className="min-w-0 flex-1 rounded-3xl border border-white/20 bg-white/95 px-5 py-4 text-slate-900 outline-none focus:border-white focus:ring-4 focus:ring-white/25"
              />
              <Button className="min-w-[120px] rounded-3xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white hover:bg-slate-800">
                Tìm
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedTab(tab)}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                    selectedTab === tab ? "bg-emerald-50 text-emerald-700 shadow-sm" : "hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
                {selectedTab === "Địa điểm ăn chay" ? restaurants.length : selectedTab === "Món ăn nổi bật" ? popularDishes.length : events.length} {selectedTab === "Địa điểm ăn chay" ? "địa điểm" : selectedTab === "Món ăn nổi bật" ? "món ăn" : "sự kiện"}
              </div>
              <Button variant="outline" className="rounded-full px-4 py-3 text-sm text-slate-700">
                Hiển thị bộ lọc
              </Button>
            </div>
          </div>
          <div className="mt-10">{renderCards()}</div>
        </div>
      </section>
    </main>
  );
}
