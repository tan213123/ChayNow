import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const demoAccounts = [
  { label: "Người dùng", email: "user@demo.com", password: "demo123" },
  { label: "Chủ quán", email: "owner@demo.com", password: "demo123" },
  { label: "Quản trị viên", email: "admin@demo.com", password: "demo123" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDemo, setSelectedDemo] = useState<string>("");

  const handleDemoClick = (account: typeof demoAccounts[number]) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedDemo(account.email);
  };

  const handleLogin = () => {
    const account = demoAccounts.find((item) => item.email === email.trim());
    if (!account || password !== account.password) {
      alert("Email hoặc mật khẩu không đúng. Vui lòng dùng demo123 cho tài khoản demo.");
      return;
    }

    localStorage.setItem(
      "authUser",
      JSON.stringify({ email: account.email, label: account.label })
    );

    navigate("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 text-emerald-700">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl">🌱</div>
            <span className="font-semibold">Chay TPHCM</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
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
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Đăng nhập</p>
                <h1 className="mt-4 text-3xl font-extrabold text-slate-900">Đăng nhập vào Chay TPHCM</h1>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Dùng tài khoản demo để đăng nhập nhanh và chuyển sang giao diện người dùng.
                </p>
              </div>

              <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                  <Button
                    onClick={handleLogin}
                    className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Đăng nhập
                  </Button>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-900">Tài khoản demo nhanh</p>
                <p className="mt-2 text-sm text-slate-500">Nhấn vào tài khoản demo để tự động điền email và mật khẩu.</p>
                <div className="mt-4 grid gap-3">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => handleDemoClick(account)}
                      className={`w-full rounded-2xl border px-4 py-4 text-left shadow-sm transition ${
                        selectedDemo === account.email
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-900">{account.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{account.email}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-400">Mật khẩu mẫu: demo123</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-emerald-600 p-8 text-white shadow-xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">Chưa có tài khoản?</p>
                  <h2 className="mt-3 text-2xl font-bold">Đăng ký nhanh</h2>
                  <p className="mt-3 text-sm leading-7 text-emerald-100/90">
                    Chọn loại tài khoản phù hợp để tham gia cộng đồng Chay TPHCM ngay lập tức.
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
                    Nếu bạn quản lý quán chay, chọn đăng ký chủ quán để đăng thông tin quán và sự kiện.
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
