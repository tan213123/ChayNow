import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { favoriteRestaurants } from "@/data/restaurants";

type AuthUser = {
  email: string;
  label: string;
};

export default function Favorites() {
  const navigate = useNavigate();
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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 text-emerald-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl">🌱</div>
            <span className="font-semibold">Chay TPHCM</span>
          </Link>
          <nav className="flex items-center gap-8 text-sm text-slate-600">
            <Link to="/" className="flex items-center gap-2 font-medium text-slate-900">
              <span>🏠</span> Trang chủ
            </Link>
            <Link to="/favorites" className="flex items-center gap-2 text-emerald-700">
              <span>♥</span> Yêu thích
            </Link>
            {authUser?.label === "Chủ quán" ? (
              <Link to="/manage" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
                <span>🏪</span> Quản lý quán
              </Link>
            ) : null}
          </nav>
          <div className="flex items-center gap-4 text-sm text-slate-700">
            {authUser ? (
              <>
                <span className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm">NV</span>
                  {authUser.label}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-full bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Địa điểm yêu thích</p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Danh sách quán chay bạn đã lưu</h1>
            </div>
            <Link to="/" className="text-sm font-semibold text-emerald-700 hover:underline">
              Quay lại Trang chủ
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {favoriteRestaurants.map((restaurant) => (
              <article key={restaurant.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm">
                    {restaurant.rating} ★
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{restaurant.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{restaurant.location}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{restaurant.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <p>{restaurant.hours}</p>
                    <p>{restaurant.reviews} đánh giá</p>
                  </div>
                  <Link to={`/restaurant/${restaurant.id}`}>
                    <Button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                      Xem chi tiết
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
