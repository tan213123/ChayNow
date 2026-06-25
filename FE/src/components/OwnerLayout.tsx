import Navbar from "@/components/Navbar";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Store, Utensils, Calendar, Star } from "lucide-react";
import type { ReactNode } from "react";

type OwnerLayoutProps = {
  children: ReactNode;
  profile?: ReactNode;
};

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const location = useLocation();

  const menuItems = [
    { to: "/manage", label: "Dashboard", icon: LayoutDashboard },
    { to: "/manage/restaurants", label: "Quản lý quán", icon: Store },
    { to: "/manage/new-dish", label: "Thực đơn", icon: Utensils },
    { to: "/manage/events", label: "Sự kiện", icon: Calendar },
    { to: "/manage/reviews", label: "Đánh giá", icon: Star },
  ];

  const isActive = (path: string) => {
    if (path === "/manage") {
      return location.pathname === "/manage";
    }
    if (path === "/manage/restaurants" && location.pathname.startsWith("/manage/edit")) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Secondary Sub-navigation for Owner */}
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-[73px] z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-emerald-700" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">{children}</section>
    </main>
  );
}
