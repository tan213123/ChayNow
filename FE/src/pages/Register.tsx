import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  register as registerApi,
  registerOwner as registerOwnerApi,
} from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";

const roleLabels: Record<Role, string> = {
  ADMIN: "Quản trị viên",
  OWNER: "Chủ quán",
  USER: "Người dùng",
};

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = params.get("type") === "owner" ? "owner" : "user";
  const [role, setRole] = useState<Role>(initialRole);
  const [ownerStep, setOwnerStep] = useState(1);

  // User form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (params.get("type") === "owner") {
      setRole("owner");
      setOwnerStep(1);
    }
  }, [params]);

  const handleUserRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải chứa ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setIsSubmitting(true);
      const registerResponse = await registerApi({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      login(registerResponse);
      toast.success("Đăng ký và đăng nhập thành công!");
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUserForm = () => (
    <form onSubmit={handleUserRegister} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Họ và tên *
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nguyễn Văn A"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Mật khẩu *
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tối thiểu 8 ký tự"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Xác nhận mật khẩu *
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
      </Button>
      {/* <div className="text-center text-sm text-slate-600">
        Đã có tài khoản? <Link to="/login" className="font-semibold text-emerald-700 hover:underline">Đăng nhập ngay</Link>
      </div> */}
    </form>
  );

    try {
      setIsSubmitting(true);
      const response = await registerApi({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

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
              placeholder="Tối thiểu 8 ký tự"
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
            <span className="font-semibold">ChayNow</span>
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-[2rem] bg-white p-8 shadow-2xl sm:p-10">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Đăng ký
            </p>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
              Tạo tài khoản ChayNow
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Thông tin được gửi trực tiếp đến API đăng ký của hệ thống.
            </p>
          </div>

          {ownerRequested ? (
            <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
              Bạn đang đăng ký tài khoản chủ quán. Sau khi đăng ký, bạn có thể
              tạo nhà hàng và thực đơn trong khu vực quản lý.
            </div>
          ) : null}

          <form
            onSubmit={handleRegister}
            className="mt-8 space-y-5 rounded-[2rem] border border-slate-200 bg-slate-50 p-7"
          >
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Họ và tên *
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                type="text"
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Email *
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Mật khẩu *
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Từ 8 đến 12 ký tự"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              Xác nhận mật khẩu *
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type="password"
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700"
            >
              {isSubmitting
                ? "Đang đăng ký..."
                : ownerRequested
                  ? "Đăng ký chủ quán"
                  : "Đăng ký tài khoản"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
