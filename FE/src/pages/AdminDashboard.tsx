import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  MessageSquareText,
  ShieldCheck,
  Store,
  UserRoundCog,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "@/services/adminDashboard.service";

const emptyStats: AdminDashboardStats = {
  totalUsers: 0,
  totalOwners: 0,
  totalAdmins: 0,
  totalRestaurants: 0,
  pendingRestaurants: 0,
  approvedRestaurants: 0,
  rejectedRestaurants: 0,
  totalReviews: 0,
  totalPostings: 0,
  pendingReports: 0,
  resolvedReports: 0,
  rejectedReports: 0,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAdminDashboardStats();
        if (active) setStats(data);
      } catch (err) {
        if (active) {
          setError(getErrorMessage(err, "Không thể tải thống kê Dashboard."));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchStats();

    return () => {
      active = false;
    };
  }, []);

  const overviewStats = [
    {
      label: "Tổng người dùng",
      value: stats.totalUsers,
      icon: Users,
      iconClassName: "bg-purple-50 text-purple-600",
    },
    {
      label: "Tổng chủ quán",
      value: stats.totalOwners,
      icon: UserRoundCog,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      label: "Tổng quản trị viên",
      value: stats.totalAdmins,
      icon: ShieldCheck,
      iconClassName: "bg-slate-100 text-slate-700",
    },
    {
      label: "Tổng nhà hàng",
      value: stats.totalRestaurants,
      icon: Store,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Tổng đánh giá",
      value: stats.totalReviews,
      icon: MessageSquareText,
      iconClassName: "bg-amber-50 text-amber-600",
    },
    {
      label: "Tổng bài đăng",
      value: stats.totalPostings,
      icon: FileText,
      iconClassName: "bg-orange-50 text-orange-600",
    },
  ];

  const restaurantStatuses = [
    {
      label: "Chờ duyệt",
      value: stats.pendingRestaurants,
      className: "bg-amber-50 text-amber-700",
      icon: AlertTriangle,
    },
    {
      label: "Đã duyệt",
      value: stats.approvedRestaurants,
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    {
      label: "Đã từ chối",
      value: stats.rejectedRestaurants,
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  ];

  const reportStatuses = [
    {
      label: "Chờ xử lý",
      value: stats.pendingReports,
      className: "bg-amber-50 text-amber-700",
      icon: AlertTriangle,
    },
    {
      label: "Đã xử lý",
      value: stats.resolvedReports,
      className: "bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    },
    {
      label: "Đã từ chối",
      value: stats.rejectedReports,
      className: "bg-red-50 text-red-700",
      icon: XCircle,
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
            Dashboard Quản Trị
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Tổng quan hoạt động và các tác vụ cần chú ý trong hệ thống.
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Tổng quan</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {overviewStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClassName}`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-3xl font-extrabold text-slate-950">
                      {loading ? "—" : stat.value}
                    </span>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-slate-600">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Action Center
              </h2>
              <p className="text-sm text-slate-600">
                Các tác vụ cần quản trị viên ưu tiên kiểm tra và xử lý.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {loading ? (
              <>
                <ActionSkeleton />
                <ActionSkeleton />
              </>
            ) : stats.pendingRestaurants === 0 && stats.pendingReports === 0 ? (
              <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 lg:col-span-2">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-950">
                    Không có tác vụ khẩn cấp
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Tất cả mục kiểm duyệt hiện đã được xử lý.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {stats.pendingRestaurants > 0 && (
                  <ActionItem
                    icon={Store}
                    title="Nhà hàng chờ duyệt"
                    description={`Có ${stats.pendingRestaurants} nhà hàng cần admin kiểm duyệt.`}
                    count={stats.pendingRestaurants}
                    buttonLabel="Xem ngay"
                    onClick={() =>
                      navigate("/admin/locations?status=PENDING")
                    }
                  />
                )}
                {stats.pendingReports > 0 && (
                  <ActionItem
                    icon={AlertTriangle}
                    title="Báo cáo chờ xử lý"
                    description={`Có ${stats.pendingReports} báo cáo cần admin xử lý.`}
                    count={stats.pendingReports}
                    buttonLabel="Sắp hỗ trợ"
                    disabled
                  />
                )}
              </>
            )}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <StatusSection
            title="Trạng thái nhà hàng"
            items={restaurantStatuses}
            loading={loading}
            total={stats.totalRestaurants}
          />
          <StatusSection
            title="Trạng thái báo cáo"
            items={reportStatuses}
            loading={loading}
            total={
              stats.pendingReports +
              stats.resolvedReports +
              stats.rejectedReports
            }
          />
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Tổng quan hệ thống
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickNote label="Tài khoản admin" value={stats.totalAdmins} loading={loading} />
            <QuickNote label="Tài khoản owner" value={stats.totalOwners} loading={loading} />
            <QuickNote label="Bài posting" value={stats.totalPostings} loading={loading} />
            <QuickNote label="Bài review" value={stats.totalReviews} loading={loading} />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

interface StatusItem {
  label: string;
  value: number;
  className: string;
  icon: typeof AlertTriangle;
}

function ActionItem({
  icon: Icon,
  title,
  description,
  count,
  buttonLabel,
  onClick,
  disabled = false,
}: {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  count: number;
  buttonLabel: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <article
      className={`group rounded-2xl border p-5 transition ${
        disabled
          ? "border-slate-200 bg-slate-50"
          : "border-amber-200 bg-amber-50/50 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            disabled
              ? "bg-slate-200 text-slate-500"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          <Icon className="h-6 w-6" />
        </span>
        <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-red-100 px-2.5 py-1 text-sm font-extrabold text-red-700">
          {count}
        </span>
      </div>

      <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
      <p className="mt-1 min-h-10 text-sm leading-5 text-slate-600">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
      >
        {buttonLabel}
        {!disabled && (
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        )}
      </button>
    </article>
  );
}

function ActionSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="h-11 w-11 rounded-xl bg-slate-200" />
      <div className="mt-4 h-5 w-40 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-64 max-w-full rounded bg-slate-200" />
      <div className="mt-4 h-9 w-24 rounded-xl bg-slate-200" />
    </div>
  );
}

function StatusSection({
  title,
  items,
  loading,
  total,
}: {
  title: string;
  items: StatusItem[];
  loading: boolean;
  total: number;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          const percentage =
            total > 0 ? Math.min((item.value / total) * 100, 100) : 0;

          return (
            <div
              key={item.label}
              className="rounded-xl bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3 font-semibold text-slate-700">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.className}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.label}
                </span>
                <span className="text-xl font-extrabold text-slate-950">
                  {loading ? "—" : item.value}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.className.includes("amber")
                      ? "bg-amber-500"
                      : item.className.includes("emerald")
                        ? "bg-emerald-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: loading ? "0%" : `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function QuickNote({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-950">
        {loading ? "—" : value}
      </p>
    </div>
  );
}
