import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { restaurants } from "@/data/restaurants";

type AuthUser = {
  email: string;
  label: string;
};

const tabLabels = ["Thông tin", "Thực đơn", "Đánh giá", "Giới thiệu"] as const;
type Tab = (typeof tabLabels)[number];

export default function RestaurantDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const restaurant = restaurants.find((item) => item.id === id);
  const [activeTab, setActiveTab] = useState<Tab>("Thông tin");
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

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-2xl text-center">
          <h1 className="text-2xl font-semibold">Không tìm thấy nhà hàng</h1>
          <p className="mt-4 text-sm text-slate-500">Vui lòng quay lại trang chủ và chọn lại.</p>
          <Link to="/">
            <Button className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </main>
    );
  }

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
            {authUser ? (
              <>
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
              </>
            ) : (
              <Link to="/login" className="rounded-full bg-slate-100 px-4 py-2 font-semibold hover:bg-slate-200">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link to="/" className="text-sm font-semibold text-slate-700 hover:underline">← Quay lại</Link>
              <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{restaurant.name}</h1>
              <p className="mt-2 text-sm text-slate-600">{restaurant.intro}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{restaurant.category}</span>
              <Button variant="outline" className="rounded-full px-4 py-2 text-sm text-slate-700">
                Thêm vào yêu thích
              </Button>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm">
                  <img src={restaurant.image} alt={restaurant.name} className="h-96 w-full object-cover" />
                </div>
                <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">{restaurant.name}</h2>
                      <p className="mt-2 text-sm text-slate-600">{restaurant.address}</p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
                      {restaurant.rating} ★
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {restaurant.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                    <div>
                      <p className="font-semibold text-slate-900">Giờ mở cửa</p>
                      <p>{restaurant.hours}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Khoảng giá</p>
                      <p>{restaurant.priceRange}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-4">
                  {tabLabels.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setActiveTab(label)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        activeTab === label ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  {activeTab === "Thông tin" && (
                    <div className="space-y-6 text-sm text-slate-600">
                      <p>{restaurant.intro}</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">Địa chỉ</p>
                          <p>{restaurant.address}</p>
                        </div>
                        <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
                          <p className="font-semibold text-slate-900">Điện thoại</p>
                          <p>{restaurant.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Thực đơn" && (
                    <div className="space-y-4">
                      {restaurant.menu.map((dish) => (
                        <div key={dish.name} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <div>
                            <p className="font-semibold text-slate-900">{dish.name}</p>
                            <p className="text-sm text-slate-500">{dish.category}</p>
                          </div>
                          <p className="font-semibold text-emerald-700">{dish.price}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "Đánh giá" && (
                    <div className="space-y-6">
                      <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
                        <p className="font-semibold text-slate-900">Viết đánh giá</p>
                        <div className="mt-3 flex items-center gap-2">
                          {[...Array(5)].map((_, index) => (
                            <span key={index} className="text-2xl text-amber-500">★</span>
                          ))}
                        </div>
                        <textarea
                          rows={4}
                          placeholder="Chia sẻ trải nghiệm của bạn..."
                          className="mt-4 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        />
                        <Button className="mt-4 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                          Gửi đánh giá
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {restaurant.reviewsList.map((review) => (
                          <div key={review.name + review.date} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="font-semibold text-slate-900">{review.name}</p>
                                <p className="text-xs text-slate-500">{review.date}</p>
                              </div>
                              <div className="flex gap-1 text-amber-500">
                                {[...Array(review.rating)].map((_, idx) => (
                                  <span key={idx}>★</span>
                                ))}
                              </div>
                            </div>
                            <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "Giới thiệu" && (
                    <div className="space-y-6 text-sm text-slate-600">
                      <div className="rounded-3xl bg-slate-50 p-6">
                        <p className="font-semibold text-slate-900">Thông tin thuộc tính của doanh nghiệp</p>
                        <p className="mt-3">Các thuộc tính này được khách hàng đề xuất và admin xác nhận.</p>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          {restaurant.features.map((feature) => (
                            <span key={feature} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Bản đồ</p>
                <div className="mt-4 h-72 rounded-3xl bg-slate-100" aria-label={restaurant.mapAlt} />
                <p className="mt-4 text-sm text-slate-600">{restaurant.address}</p>
                <Button className="mt-4 w-full rounded-2xl bg-transparent border border-emerald-600 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                  Xem trên Google Maps
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
