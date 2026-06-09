import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  Shield,
  SlidersHorizontal,
  Sprout,
  Store,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
};

const adminNavItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    enabled: true,
  },
  {
    to: "/admin/users",
    label: "Quản lý người dùng",
    icon: Users,
    enabled: true,
  },
  {
    to: "/admin/locations",
    label: "Quản lý địa điểm",
    icon: Store,
    enabled: false,
  },
  {
    to: "/admin/posts",
    label: "Quản lý bài đăng",
    icon: FileText,
    enabled: false,
  },
  {
    to: "/admin/attributes",
    label: "Quản lý thuộc tính",
    icon: SlidersHorizontal,
    enabled: false,
  },
  {
    to: "/admin/reports",
    label: "Xử lý báo cáo",
    icon: AlertTriangle,
    enabled: false,
  },
];

export default function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authUser");
    navigate("/login", { replace: true });
  };

  const initials =
    user?.fullName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "AD";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-40 h-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-full items-center justify-between px-8">
          <Link to="/admin" className="flex w-72 items-center gap-3 text-emerald-700">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
              <Sprout className="h-7 w-7" />
            </span>
            <span className="text-xl font-bold tracking-tight">ChayNow</span>
          </Link>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3 text-slate-600">
              <Shield className="h-5 w-5" />
              <span className="text-lg font-medium">{title}</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-200"
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white ring-2 ring-slate-200">
                    {initials}
                  </span>
                )}
                <span className="font-semibold text-slate-900">
                  {user?.fullName || "Admin Hệ Thống"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-[320px_1fr]">
        <aside className="border-r border-slate-200 bg-white px-5 py-6">
          <nav className="space-y-3">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.to ||
                (item.to !== "/admin" && location.pathname.startsWith(item.to));

              if (!item.enabled) {
                return (
                  <button
                    key={item.to}
                    type="button"
                    disabled
                    className="flex w-full items-center justify-between rounded-xl px-5 py-4 text-left text-slate-400"
                    title="Chức năng sẽ làm sau"
                  >
                    <span className="flex items-center gap-4">
                      <Icon className="h-6 w-6" />
                      <span className="text-base font-medium">{item.label}</span>
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-4 rounded-xl px-5 py-4 text-base font-semibold transition ${isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                >
                  <Icon className="h-6 w-6" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
            <div className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
              <BarChart3 className="h-4 w-4" />
              Khu vực quản trị
            </div>

          </div>
        </aside>

        <section className="px-8 py-10">{children}</section>
      </div>
    </main>
  );
}
