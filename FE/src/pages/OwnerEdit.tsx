import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { restaurants } from "@/data/restaurants";

const defaultRestaurant = restaurants[0];

type OwnerRestaurant = typeof defaultRestaurant;
type AuthUser = {
  email: string;
  label: string;
};

export default function OwnerEdit() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [restaurant, setRestaurant] = useState<OwnerRestaurant>(defaultRestaurant);
  const [tagString, setTagString] = useState(defaultRestaurant.tags.join(", "));

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
        const parsed = JSON.parse(storedRestaurant) as OwnerRestaurant;
        setRestaurant(parsed);
        setTagString(parsed.tags.join(", "));
      } catch {
        localStorage.removeItem("ownerRestaurant");
      }
    }
  }, [navigate]);

  const handleInputChange = (key: keyof OwnerRestaurant, value: string) => {
    setRestaurant((current) => ({ ...current, [key]: value } as OwnerRestaurant));
  };

  const handleSave = () => {
    const updatedRestaurant = {
      ...restaurant,
      tags: tagString.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    localStorage.setItem("ownerRestaurant", JSON.stringify(updatedRestaurant));
    navigate("/manage");
  };

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
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm">{authUser?.label?.[0] ?? "U"}</span>
              {authUser?.label ?? "Chủ quán"}
            </span>
            <Link to="/login" className="rounded-full bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200">
              Đăng xuất
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Chỉnh sửa quán</p>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Cập nhật thông tin quán của bạn</h1>
            </div>
            <Button onClick={handleSave} className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              Lưu thay đổi
            </Button>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tên quán</label>
                <input
                  value={restaurant.name}
                  onChange={(event) => handleInputChange("name", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Địa chỉ</label>
                <input
                  value={restaurant.address}
                  onChange={(event) => handleInputChange("address", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Số điện thoại</label>
                <input
                  value={restaurant.phone}
                  onChange={(event) => handleInputChange("phone", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Giờ mở cửa</label>
                <input
                  value={restaurant.hours}
                  onChange={(event) => handleInputChange("hours", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Loại hình</label>
                <input
                  value={restaurant.category}
                  onChange={(event) => handleInputChange("category", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Khoảng giá</label>
                <input
                  value={restaurant.priceRange}
                  onChange={(event) => handleInputChange("priceRange", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Tags</label>
                <input
                  value={tagString}
                  onChange={(event) => setTagString(event.target.value)}
                  placeholder="Chay Á, Chay Âu, Healthy"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Giới thiệu ngắn</label>
                <textarea
                  value={restaurant.intro}
                  onChange={(event) => handleInputChange("intro", event.target.value)}
                  rows={5}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Thông tin quán của bạn sẽ được lưu trong trình duyệt và giữ trạng thái khi tải lại.</p>
            <Link to="/manage" className="text-sm font-semibold text-emerald-700 hover:underline">
              Quay lại Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
