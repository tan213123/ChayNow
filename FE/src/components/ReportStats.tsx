import {
  AlertTriangle,
  Clock3,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

interface Props {
  reports: any[];
}

export default function ReportStats({
  reports,
}: Props) {
  const pending = reports.filter(
    (r) => r.status === "pending"
  ).length;

  const processing = reports.filter(
    (r) => r.status === "processing"
  ).length;

  const resolved = reports.filter(
    (r) => r.status === "resolved"
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* Tổng báo cáo */}
      <div className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Tổng báo cáo
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
              {reports.length}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Tất cả báo cáo trong hệ thống
            </p>
          </div>

          <div className="rounded-3xl bg-red-100 p-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Chưa xử lý
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
              {pending}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Đang chờ Admin xử lý
            </p>
          </div>

          <div className="rounded-3xl bg-yellow-100 p-4">
            <Clock3 className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Processing */}
      <div className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Đang xử lý
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
              {processing}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Đang được kiểm tra
            </p>
          </div>

          <div className="rounded-3xl bg-blue-100 p-4">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Resolved */}
      <div className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Đã giải quyết
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">
              {resolved}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Báo cáo đã đóng
            </p>
          </div>

          <div className="rounded-3xl bg-green-100 p-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}