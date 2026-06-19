
import Navbar from "@/components/Navbar";
import { AlertTriangle, CheckCircle2, Clock3, XCircle } from "lucide-react";

export default function ReportManagement() {
  const reports = [
    {
      id: 1,
      reporter: "Nguyễn Văn An",
      targetType: "Đánh giá",
      reason: "Nội dung không phù hợp, spam",
      status: "pending",
      createdAt: "29/05/2026 - 07:00:00",
    },
    {
      id: 2,
      reporter: "Lê Thị Cẩm",
      targetType: "Bài đăng",
      reason: "Hình ảnh sai sự thật",
      status: "resolved",
      createdAt: "20/05/2026 - 07:00:00",
    },
  ];

  const total = reports.length;
  const pending = reports.filter((r) => r.status === "pending").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const rejected = reports.filter((r) => r.status === "rejected").length;

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Quản lý báo cáo
          </h1>

          <p className="mt-2 text-slate-500">
            Xử lý các báo cáo vi phạm từ người dùng
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-4xl font-bold">{total}</p>

            <p className="mt-2 text-slate-500">Tổng báo cáo</p>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
            <p className="text-4xl font-bold text-yellow-600">
              {pending}
            </p>

            <p className="mt-2 text-yellow-700">Chờ xử lý</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <p className="text-4xl font-bold text-emerald-600">
              {resolved}
            </p>

            <p className="mt-2 text-emerald-700">Đã xử lý</p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-4xl font-bold text-red-600">
              {rejected}
            </p>

            <p className="mt-2 text-red-700">Đã từ chối</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mt-8 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <span className="font-semibold text-slate-700">
              Lọc theo:
            </span>

            <select className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-500 md:w-64">
              <option>Tất cả trạng thái</option>
              <option>Chờ xử lý</option>
              <option>Đã xử lý</option>
              <option>Đã từ chối</option>
            </select>
          </div>
        </div>

        {/* Report List */}
        <div className="mt-8 space-y-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border bg-white p-7 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                    <AlertTriangle className="text-red-500" size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {report.reporter}

                      <span className="ml-2 font-normal text-slate-500">
                        báo cáo
                      </span>

                      <span className="ml-2">
                        {report.targetType}
                      </span>
                    </h3>

                    <p className="mt-1 text-slate-500">
                      {report.createdAt}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  {report.status === "pending" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                      <Clock3 size={16} />
                      Chờ xử lý
                    </span>
                  )}

                  {report.status === "resolved" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 size={16} />
                      Đã xử lý
                    </span>
                  )}

                  {report.status === "rejected" && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                      <XCircle size={16} />
                      Đã từ chối
                    </span>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-800">
                  Lý do báo cáo:
                </p>

                <p className="mt-3 text-slate-600">
                  {report.reason}
                </p>
              </div>

              {/* Actions */}
              {report.status === "pending" && (
                <div className="mt-6 flex flex-wrap gap-4">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700">
                    <CheckCircle2 size={18} />
                    Xác nhận và xử lý
                  </button>

                  <button className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700">
                    <XCircle size={18} />
                    Từ chối báo cáo
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}