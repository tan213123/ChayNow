import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types/auth";

const roleLabels: Record<Role, string> = {
  ADMIN: "Quản trị viên",
  OWNER: "Chủ quán",
  USER: "Người dùng",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(`${path}/`))
    );
  };

  const navLinks = [
    { to: "/", label: "Trang chủ", icon: "⌂" },
    { to: "/favorites", label: "Yêu thích", icon: "♡" },
    ...(user?.role === "OWNER"
      ? [
          { to: "/manage", label: "Dashboard", icon: "▦" },
          { to: "/manage/restaurants", label: "Quản lý quán", icon: "▣" },
          { to: "/manage/new-dish", label: "Thực đơn", icon: "☰" },
          { to: "/manage/events", label: "Sự kiện", icon: "*" },
          { to: "/manage/reviews", label: "Đánh giá", icon: "★" },
        ]
      : []),
  ];

  const isLoggedIn = isAuthenticated && Boolean(user);

  const getInitials = () => {
    const source = user?.fullName || user?.email || "";
    return source.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-3 text-emerald-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl transition-transform group-hover:scale-110">
            ♧
          </div>
          <span className="text-lg font-bold tracking-tight">ChayNow</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-medium transition-all ${
                isActive(link.to)
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm transition-all sm:flex ${
                  isActive("/profile")
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {getInitials()}
                </span>
                <span className="font-medium">{roleLabels[user.role]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 transition hover:text-slate-900"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Đăng ký
              </Link>
            </div>
          )}

          <button
            className="flex flex-col gap-1.5 rounded-xl p-2 transition hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-slate-700 transition-all ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-slate-700 transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-slate-700 transition-all ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="space-y-2 border-t border-slate-100 bg-white px-6 py-4 shadow-lg md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive(link.to)
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-2">
            {isLoggedIn && user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {getInitials()}
                  </span>
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
