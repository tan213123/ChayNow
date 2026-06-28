import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/services/api.service";
import {
  getAdminReports,
  getAdminReportStats,
  resolveAdminReport,
  type AdminReport,
  type AdminReportStats,
  type ReportStatus,
} from "@/services/admin-report.service";
import AdminLayout from "@/components/AdminLayout";
export default function ReportManagement() {
  const [reports, setReports] = useState<AdminReport[]>([]);

  const [stats, setStats] = useState<AdminReportStats>({
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    rejectedReports: 0,
  });

  const [statusFilter, setStatusFilter] =
    useState<ReportStatus | "ALL">("ALL");

  const [loading, setLoading] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);

      const [reportRes, statRes] = await Promise.all([
        getAdminReports({
          page: 0,
          size: 50,
          status:
            statusFilter === "ALL"
              ? undefined
              : statusFilter,
        }),
        getAdminReportStats(),
      ]);

      setReports(reportRes.content);
      setStats(statRes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void Promise.resolve().then(loadReports);
  }, [loadReports]);

  const handleResolve = async (
    id: number,
    action: "ACCEPT" | "REJECT",
  ) => {
    try {
      await resolveAdminReport(id, {
        action,
      });
      toast.success("Xử lý báo cáo thành công.");
      loadReports();
    } catch (error) {
      console.error(error);
      toast.error(getApiErrorMessage(error, "Xử lý báo cáo thất bại. Vui lòng thử lại."));
    }
  };

return (
      <AdminLayout title=" Quản lý báo cáo">

  <main className="min-h-screen bg-slate-100">

    <section className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        

        <p className="mt-2 text-slate-500">
          Xử lý các báo cáo vi phạm từ người dùng
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl  bg-white p-6 shadow-sm">
          <p className="text-4xl font-bold">
            {stats.totalReports}
          </p>

          <p className="mt-2 text-slate-500">
            Tổng báo cáo
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <p className="text-4xl font-bold text-yellow-600">
            {stats.pendingReports}
          </p>

          <p className="mt-2 text-yellow-700">
            Chờ xử lý
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <p className="text-4xl font-bold text-emerald-600">
            {stats.resolvedReports}
          </p>

          <p className="mt-2 text-emerald-700">
            Đã xử lý
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <p className="text-4xl font-bold text-red-600">
            {stats.rejectedReports}
          </p>

          <p className="mt-2 text-red-700">
            Đã từ chối
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <span className="font-semibold text-slate-700">
            Lọc theo:
          </span>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as ReportStatus | "ALL",
              )
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 md:w-64"
          >
            <option value="ALL">
              Tất cả trạng thái
            </option>

            <option value="PENDING">
              Chờ xử lý
            </option>

            <option value="RESOLVED">
              Đã xử lý
            </option>

            <option value="REJECTED">
              Đã từ chối
            </option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="mt-10 text-center text-slate-500">
          Đang tải dữ liệu...
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow">
          Không có báo cáo nào.
        </div>
      )}

      {!loading && (
        <div className="mt-8 space-y-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border bg-white p-7 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                    <AlertTriangle
                      className="text-red-500"
                      size={24}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {report.reporter.fullName}

                      <span className="ml-2 font-normal text-slate-500">
                        báo cáo
                      </span>

                      <span className="ml-2">
                        {report.type}
                      </span>
                    </h3>

                    <p className="mt-1 text-slate-500">
                      {new Date(
                        report.createdAt,
                      ).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div>
                  {report.status ===
                    "PENDING" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                      <Clock3 size={16} />
                      Chờ xử lý
                    </span>
                  )}

                  {report.status ===
                    "RESOLVED" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 size={16} />
                      Đã xử lý
                    </span>
                  )}

                  {report.status ===
                    "REJECTED" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                      <XCircle size={16} />
                      Đã từ chối
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-800">
                  Lý do báo cáo
                </p>

                <p className="mt-3 text-slate-600">
                  {report.reason}
                </p>

                <hr className="my-4" />

                <p className="font-semibold">
                  Nội dung bị báo cáo
                </p>

                <p className="mt-2 font-medium">
                  {report.target.title}
                </p>

                <p className="mt-2 whitespace-pre-wrap text-slate-600">
                  {report.target.content}
                </p>
              </div>

              {report.status ===
                "PENDING" && (
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={() =>
                      handleResolve(
                        report.id,
                        "ACCEPT",
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={18} />
                    Xác nhận xử lý
                  </button>

                  <button
                    onClick={() =>
                      handleResolve(
                        report.id,
                        "REJECT",
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                  >
                    <XCircle size={18} />
                    Từ chối báo cáo
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  </main>
      </AdminLayout>
);
}
