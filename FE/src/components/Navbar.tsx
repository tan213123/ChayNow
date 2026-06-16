import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== "/" && location.pathname.startsWith(`${path}/`))
    );
  };

  const navLinks = [
    { to: "/", label: "Trang chủ", icon: "🏠" },
    { to: "/favorites", label: "Yêu thích", icon: "♥" },
    ...(user?.role === "OWNER"
      ? [
          { to: "/manage", label: "Dashboard", icon: "▦" },
          { to: "/manage/restaurants", label: "Quản lý quán", icon: "🏪" },
          { to: "/manage/new-dish", label: "Thực đơn", icon: "☰" },
          { to: "/manage/reviews", label: "Đánh giá", icon: "★" },
        ]
      : []),
  ];

  // Get user initials
  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-emerald-700 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-xl transition-transform group-hover:scale-110">
            🌱
          </div>
          <span className="font-bold text-lg tracking-tight">ChayNow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className={`hidden sm:flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all ${
                  isActive("/profile")
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  {getInitials(user.email)}
                </span>
                <span className="font-medium">{roleLabels[user.role]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:block rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl hover:bg-slate-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-slate-700 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-2 shadow-lg">
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
          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {getInitials(user.email)}
                  </span>
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-full text-left rounded-2xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
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
