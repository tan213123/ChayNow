import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Role = "user" | "owner";

export default function Register() {
  const [params] = useSearchParams();
  const initialRole = params.get("type") === "owner" ? "owner" : "user";
  const [role, setRole] = useState<Role>(initialRole);
  const [ownerStep, setOwnerStep] = useState(1);

  useEffect(() => {
    if (params.get("type") === "owner") {
      setRole("owner");
      setOwnerStep(1);
    }
  }, [params]);

  const renderUserForm = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Họ và tên *
        </label>
        <input
          type="text"
          placeholder="Nguyễn Văn A"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email *
        </label>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Mật khẩu *
        </label>
        <input
          type="password"
          placeholder="Tối thiểu 6 ký tự"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Xác nhận mật khẩu *
        </label>
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        />
      </div>
      <Button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
        Đăng ký
      </Button>
      {/* <div className="text-center text-sm text-slate-600">
        Đã có tài khoản? <Link to="/login" className="font-semibold text-emerald-700 hover:underline">Đăng nhập ngay</Link>
      </div> */}
    </div>
  );

  const renderOwnerForm = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 overflow-hidden rounded-full bg-slate-100 p-1 text-sm shadow-sm">
        <button
          type="button"
          className={`flex-1 rounded-full py-3 text-sm font-semibold transition ${ownerStep === 1 ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-white"}`}
          onClick={() => setOwnerStep(1)}
        >
          Thông tin cá nhân
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full py-3 text-sm font-semibold transition ${ownerStep === 2 ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-white"}`}
          onClick={() => setOwnerStep(2)}
        >
          Thông tin quán
        </button>
      </div>

      {ownerStep === 1 ? (
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Họ và tên *
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email *
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mật khẩu *
            </label>
            <input
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setOwnerStep(2)}
            >
              Tiếp theo
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tên nhà hàng / Quán ăn *
            </label>
            <input
              type="text"
              placeholder="VD: Quán Chay An Lạc"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Địa chỉ *
              </label>
              <input
                type="text"
                placeholder="123 Đường ABC"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Quận / Huyện *
              </label>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                <option>Quận 1</option>
                <option>Quận 3</option>
                <option>Quận 10</option>
                <option>Phú Nhuận</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Giờ mở cửa *
              </label>
              <input
                type="text"
                placeholder="08:00 SA"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Giờ đóng cửa *
              </label>
              <input
                type="text"
                placeholder="08:00 CH"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Loại hình *
              </label>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                <option>Bình Dân</option>
                <option>Cao Cấp</option>
                <option>Buffet</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Mức giá *
              </label>
              <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100">
                <option>Rẻ (&lt;100.000đ)</option>
                <option>Trung Bình</option>
                <option>Cao</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Các món ăn chính *
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                "Cơm",
                "Bún",
                "Phở",
                "Hủ tiếu",
                "Mì",
                "Miến",
                "Cháo",
                "Bánh",
                "Cuốn",
                "Gỏi / Salad",
                "Súp / Canh",
                "Lẩu",
                "Món ăn vặt",
                "Đồ uống",
                "Tráng miệng",
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mô tả quán (tùy chọn)
            </label>
            <textarea
              rows={4}
              placeholder="Giới thiệu ngắn gọn về quán của bạn, không gian, đặc sản..."
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => setOwnerStep(1)}
            >
              Quay lại
            </button>
            <Button className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              Hoàn tất đăng ký
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 text-emerald-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
              🌱
            </div>
            <span className="font-semibold">Chay TPHCM</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-[2rem] bg-white p-10 shadow-2xl">
          <div className="space-y-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Đăng ký tài khoản
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {role === "user" ? "Đăng ký người dùng" : "Đăng ký chủ quán"}
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600">
              {role === "user"
                ? "Tham gia cộng đồng yêu ăn chay để lưu địa điểm, xem review và ghi nhớ nhà hàng yêu thích."
                : "Đăng ký để quảng bá quán ăn chay của bạn và thu hút khách hàng mới."}
            </p>
          </div>

          <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row">
              <button
                type="button"
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition ${role === "user" ? "bg-emerald-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                onClick={() => {
                  setRole("user");
                  setOwnerStep(1);
                }}
              >
                Đăng ký người dùng
              </button>
              <button
                type="button"
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition ${role === "owner" ? "bg-emerald-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                onClick={() => {
                  setRole("owner");
                  setOwnerStep(1);
                }}
              >
                Đăng ký chủ quán
              </button>
            </div>

            <div className="mt-8 bg-white p-8 rounded-[2rem] shadow-sm">
              {role === "user" ? renderUserForm() : renderOwnerForm()}
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            <p>
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-semibold text-emerald-700 hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
            <p className="mt-2">
              Nếu bạn là chủ quán, chọn "Đăng ký chủ quán" để tạo hồ sơ nhà
              hàng.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
