import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { login as loginApi } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types/auth";

const roleLabels: Record<Role, string> = {
  ADMIN: "Quản trị viên",
  OWNER: "Chủ quán",
  USER: "Người dùng",
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/";

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      setIsSubmitting(true);
      const loginResponse = await loginApi({
        email: email.trim(),
        password,
      });

      login(loginResponse);

      // Temporary compatibility for pages that still read the old authUser key.
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          email: loginResponse.user.email,
          label: roleLabels[loginResponse.user.role],
        }),
      );

      toast.success("Đăng nhập thành công.");
      
      const destination =
        loginResponse.user.role === "ADMIN"
          ? "/admin"
          : loginResponse.user.role === "OWNER" && redirectTo === "/"
            ? "/manage/restaurants"
            : redirectTo;
      navigate(destination, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại. Vui lòng thử lại.";
      toast.error(message);
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
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Trang chủ
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
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                  Đăng nhập
                </p>
                <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
                  Đăng nhập vào ChayNow
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Sử dụng tài khoản đã đăng ký để tiếp tục quản lý hồ sơ, yêu
                  thích và khu vực chủ quán.
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-8"
              >
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      type="email"
                      autoComplete="email"
                      placeholder="your@email.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Mật khẩu
                    </label>
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type="password"
                      autoComplete="current-password"
                      placeholder="Nhập mật khẩu"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-[2rem] bg-emerald-600 p-8 text-white shadow-xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">
                    Chưa có tài khoản?
                  </p>
                  <h2 className="mt-3 text-2xl font-bold">Đăng ký nhanh</h2>
                  <p className="mt-3 text-sm leading-7 text-emerald-100/90">
                    Chọn loại tài khoản phù hợp để tham gia cộng đồng ChayNow.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    to="/register?type=user"
                    className="block rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Đăng ký người dùng
                  </Link>
                  <Link
                    to="/register?type=owner"
                    className="block rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Đăng ký chủ quán
                  </Link>
                </div>
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-emerald-100">
                  <p className="font-semibold">Gợi ý</p>
                  <p className="mt-2 leading-6 text-emerald-100/90">
                    Nếu bạn quản lý quán chay, chọn đăng ký chủ quán để đăng
                    thông tin quán và sự kiện.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
