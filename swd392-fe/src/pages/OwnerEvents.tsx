import { useState } from "react";
import { Link } from "react-router-dom";

const eventTypes = [
  { id: "discount", label: "Giảm giá", icon: "🏷️" },
  { id: "charity", label: "Từ thiện", icon: "♥" },
];

export default function OwnerEvents() {
  const [eventType, setEventType] = useState("charity");

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
            <Link to="/manage" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
              <span>🏪</span> Quản lý quán
            </Link>
          </nav>
          <div className="flex items-center gap-4 text-sm text-slate-700">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60"
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
              Trần Thị Bình
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              ↩ Đăng xuất
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] bg-white p-10 shadow-xl">
          <div className="mb-10 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Tạo sự kiện mới</p>
            <h1 className="text-4xl font-extrabold text-slate-900">Tạo sự kiện mới</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Tạo chương trình giảm giá hoặc hoạt động từ thiện cho quán, giúp khách hàng dễ dàng biết đến hơn.
            </p>
          </div>

          <form className="space-y-8">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <p className="mb-4 text-sm font-semibold text-slate-700">Loại sự kiện *</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {eventTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEventType(type.id)}
                    className={`rounded-3xl border px-6 py-4 text-left text-sm font-semibold transition ${
                      eventType === type.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-lg">{type.icon}</span>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Tiêu đề sự kiện *</label>
                <input
                  type="text"
                  placeholder="VD: Giảm giá 20% tất cả món ăn"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700">Mô tả chi tiết *</label>
                <textarea
                  rows={5}
                  placeholder="Mô tả chi tiết về sự kiện, điều kiện áp dụng..."
                  className="w-full resize-none rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Ngày bắt đầu *</label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
              <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Ngày kết thúc *</label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </div>

            {eventType === "charity" ? (
              <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Thời gian từ thiện *</label>
                <input
                  type="text"
                  placeholder="VD: 11:00 - 12:00 hàng ngày"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
                <p className="text-xs text-slate-400">Ghi rõ khung giờ và tần suất phát cơm/suất ăn</p>
              </div>
            ) : (
              <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <label className="block text-sm font-semibold text-slate-700">Phần trăm giảm giá *</label>
                <input
                  type="number"
                  placeholder="VD: 20"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
                <p className="text-xs text-slate-400">Nhập số từ 1 đến 100</p>
              </div>
            )}

            <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <label className="block text-sm font-semibold text-slate-700">Hình ảnh sự kiện</label>
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-600">
                  ⬆
                </div>
                <p className="mt-3 text-sm font-semibold">Click để tải lên hoặc kéo thả ảnh vào đây</p>
                <p className="mt-2 text-xs text-slate-400">PNG, JPG, JPEG (Max 5MB)</p>
                <input type="file" className="sr-only" />
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="text-sm text-slate-500">
                <p className="font-semibold text-slate-900">Lưu ý</p>
                <p>Thông tin đủ rõ sẽ giúp sự kiện hiển thị tốt hơn trên trang quán.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/manage"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Hủy
                </Link>
                <button
                  type="button"
                  className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  + Tạo sự kiện
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
