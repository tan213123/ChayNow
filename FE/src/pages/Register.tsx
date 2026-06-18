import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  register as registerApi,
  registerOwner as registerOwnerApi,
} from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types/auth";

const roleLabels: Record<Role, string> = {
  ADMIN: "Quản trị viên",
  OWNER: "Chủ quán",
  USER: "Người dùng",
};

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const ownerRequested = searchParams.get("type") === "owner";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      toast.error("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }
    if (password.length < 8 || password.length > 12) {
      toast.error("Mật khẩu phải có từ 8 đến 12 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setIsSubmitting(true);
      const register = ownerRequested ? registerOwnerApi : registerApi;
      const response = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      login(response);
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          email: response.user.email,
          label: roleLabels[response.user.role],
        }),
      );
      toast.success(
        ownerRequested
          ? "Đăng ký tài khoản chủ quán thành công."
          : "Đăng ký tài khoản thành công.",
      );
      navigate(ownerRequested ? "/manage/restaurants" : "/", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Đăng ký thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
