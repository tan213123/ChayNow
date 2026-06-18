import {
  AlertTriangle,
  FileText,
  Store,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";

const stats = [
  {
    label: "Tổng địa điểm",
    value: "6",
    icon: Store,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "Tổng người dùng",
    value: "523",
    icon: Users,
    iconClassName: "bg-purple-50 text-purple-600",
  },
  {
    label: "Bài đăng",
    value: "10",
    icon: FileText,
    iconClassName: "bg-orange-50 text-orange-600",
  },
  {
    label: "Báo cáo chờ xử lý",
    value: "1",
    icon: AlertTriangle,
    iconClassName: "bg-red-50 text-red-600",
  },
];

const actions = [
  {
    to: "/admin/users",
    title: "Quản lý người dùng",
    description: "Xem và quản lý tài khoản người dùng",
    icon: Users,
    iconClassName: "text-purple-600",
    enabled: true,
  },
  {
    to: "/admin/locations",
    title: "Quản lý địa điểm",
    description: "Duyệt và quản lý các địa điểm ăn chay",
    icon: Store,
    iconClassName: "text-blue-600",
    enabled: false,
  },
  {
    to: "/admin/posts",
    title: "Quản lý bài đăng",
    description: "Duyệt và quản lý bài đăng món ăn",
    icon: FileText,
    iconClassName: "text-orange-600",
    enabled: false,
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
            Dashboard Quản Trị
          </h1>
          <p className="mt-3 text-lg text-slate-600">Tổng quan hệ thống</p>
        </div>

        <div className="grid gap-7 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-16 w-16 items-center justify-center rounded-xl ${stat.iconClassName}`}
                  >
                    <Icon className="h-8 w-8" />
                  </span>
                  <span className="text-4xl font-extrabold text-slate-950">
                    {stat.value}
                  </span>
                </div>
                <p className="mt-7 text-lg text-slate-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const content = (
              <>
                <Icon className={`h-10 w-10 ${action.iconClassName}`} />
                <h2 className="mt-6 text-2xl font-bold text-slate-950">
                  {action.title}
                </h2>
                <p className="mt-4 max-w-sm text-base leading-7 text-slate-600">
                  {action.description}
                </p>
              </>
            );

            if (!action.enabled) {
              return (
                <div
                  key={action.title}
                  className="rounded-2xl border border-slate-200 bg-white p-8 opacity-70 shadow-sm"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={action.title}
                to={action.to}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
