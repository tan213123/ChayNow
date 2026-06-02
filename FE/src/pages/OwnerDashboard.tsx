import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { restaurants } from "@/data/restaurants";

const defaultRestaurant = restaurants[0];

type AuthUser = {
  email: string;
  label: string;
};

type OwnerRestaurant = typeof defaultRestaurant;

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [ownerRestaurant, setOwnerRestaurant] = useState<OwnerRestaurant>(defaultRestaurant);

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
      return;
    }

    const storedRestaurant = localStorage.getItem("ownerRestaurant");
    if (storedRestaurant) {
      try {
        setOwnerRestaurant(JSON.parse(storedRestaurant));
      } catch {
        localStorage.removeItem("ownerRestaurant");
      }
    }
  }, [navigate]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
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
            <Link to="/manage" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <span>🏪</span> Quản lý quán
            </Link>
          </nav>
          <div className="flex items-center gap-4 text-sm text-slate-700">
            <span className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm">TB</span>
              Trần Thị Bình
            </span>
            <button className="rounded-full bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Dashboard Chủ Quán</p>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Quản lý quán ăn và bài đăng của bạn</h1>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <img src={ownerRestaurant.image} alt={ownerRestaurant.name} className="h-28 w-28 rounded-[2rem] object-cover" />
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{ownerRestaurant.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{ownerRestaurant.address}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{ownerRestaurant.category}</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{ownerRestaurant.hours}</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => navigate("/manage/edit")} className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                Chỉnh sửa
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Đánh giá trung bình</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{ownerRestaurant.rating}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Tổng đánh giá</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">{ownerRestaurant.reviews}</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Bài đăng</p>
              <p className="mt-4 text-3xl font-extrabold text-slate-900">3</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Link
              to="/manage/new-dish"
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-lg font-semibold text-slate-900">Đăng món ăn mới</p>
              <p className="mt-3 text-sm text-slate-500">Chia sẻ món ăn đặc biệt của quán bạn với mọi người.</p>
            </Link>
            <Link
              to="/manage/events"
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-lg font-semibold text-slate-900">Tạo sự kiện</p>
              <p className="mt-3 text-sm text-slate-500">Tạo chương trình giảm giá hoặc hoạt động từ thiện cho quán.</p>
            </Link>
            <Link
              to="/manage/reviews"
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-lg font-semibold text-slate-900">Xem đánh giá</p>
              <p className="mt-3 text-sm text-slate-500">Xem và phản hồi các đánh giá mới nhất từ khách hàng.</p>
            </Link>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Đánh giá gần đây</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[2rem] bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Nguyễn Văn An</p>
                <p className="mt-2 text-sm text-slate-600">Đồ ăn rất ngon, không gian đẹp, nhân viên nhiệt tình. Mình đã thử món bún riêu chay và phở chay, cả hai đều tuyệt vời!</p>
                <p className="mt-3 text-xs text-slate-400">15/5/2026</p>
              </div>
              <div className="rounded-[2rem] bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Lê Thị Cẩm</p>
                <p className="mt-2 text-sm text-slate-600">Không gian quán sạch và yên tĩnh, phù hợp gặp gỡ bạn bè. Món ăn ngon, nước dùng đậm đà.</p>
                <p className="mt-3 text-xs text-slate-400">18/5/2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
