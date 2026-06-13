import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

const fakeReports = [
  {
    id: "RP001",
    reporter: "Nguyễn Văn An",
    target: "Quán Chay Sen",
    type: "Spam",
    description: "Đăng quá nhiều bài quảng cáo.",
    status: "pending",
    createdAt: "2026-05-20",
  },
  {
    id: "RP002",
    reporter: "Lê Thị Cẩm",
    target: "Review #123",
    type: "Ngôn từ phản cảm",
    description: "Review có nội dung xúc phạm.",
    status: "resolved",
    createdAt: "2026-05-21",
  },
  {
    id: "RP003",
    reporter: "Trần Minh Khang",
    target: "Quán Chay An Lạc",
    type: "Đánh giá giả",
    description: "Có dấu hiệu tự tạo review.",
    status: "processing",
    createdAt: "2026-05-22",
  },
];

export default function ReportManagement() {
  const [reports, setReports] =
    useState(fakeReports);

  const [keyword, setKeyword] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchKeyword =
        report.reporter
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          ) ||
        report.target
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          );

      const matchStatus =
        statusFilter === "all" ||
        report.status === statusFilter;

      return (
        matchKeyword && matchStatus
      );
    });
  }, [
    reports,
    keyword,
    statusFilter,
  ]);

  const updateStatus = (
    id: string,
    status: string
  ) => {
    setReports((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );
  };

  const deleteReport = (
    id: string
  ) => {
    if (
      !window.confirm(
        "Xóa báo cáo?"
      )
    )
      return;

    setReports((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Report Management
          </p>

          <h1 className="mt-3 text-4xl font-extrabold">
            Quản lý báo cáo
          </h1>
        </div>

        {/* Stats */}

        <div className="mb-8 grid gap-6 lg:grid-cols-4">
          <StatCard
            title="Tổng báo cáo"
            value={reports.length}
          />

          <StatCard
            title="Chưa xử lý"
            value={
              reports.filter(
                (r) =>
                  r.status ===
                  "pending"
              ).length
            }
          />

          <StatCard
            title="Đang xử lý"
            value={
              reports.filter(
                (r) =>
                  r.status ===
                  "processing"
              ).length
            }
          />

          <StatCard
            title="Đã giải quyết"
            value={
              reports.filter(
                (r) =>
                  r.status ===
                  "resolved"
              ).length
            }
          />
        </div>

        {/* Filter */}

        <div className="mb-8 rounded-[2rem] border bg-white p-6 shadow-sm">

          <div className="grid gap-4 lg:grid-cols-2">

            <input
              placeholder="Tìm người báo cáo hoặc đối tượng..."
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target.value
                )
              }
              className="rounded-2xl border px-4 py-3"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-2xl border px-4 py-3"
            >
              <option value="all">
                Tất cả
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="processing">
                Processing
              </option>

              <option value="resolved">
                Resolved
              </option>
            </select>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-[2rem] border bg-white shadow-sm">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>
                <th className="p-4 text-left">
                  Mã
                </th>

                <th className="p-4 text-left">
                  Người báo cáo
                </th>

                <th className="p-4 text-left">
                  Đối tượng
                </th>

                <th className="p-4 text-left">
                  Loại
                </th>

                <th className="p-4 text-left">
                  Ngày tạo
                </th>

                <th className="p-4 text-left">
                  Trạng thái
                </th>

                <th className="p-4 text-center">
                  Thao tác
                </th>
              </tr>

            </thead>

            <tbody>

              {filteredReports.map(
                (report) => (
                  <tr
                    key={report.id}
                    className="border-t"
                  >
                    <td className="p-4 font-semibold">
                      {report.id}
                    </td>

                    <td className="p-4">
                      {
                        report.reporter
                      }
                    </td>

                    <td className="p-4">
                      {report.target}
                    </td>

                    <td className="p-4">
                      {report.type}
                    </td>

                    <td className="p-4">
                      {
                        report.createdAt
                      }
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          report.status ===
                          "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : report.status ===
                              "processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {
                          report.status
                        }
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            updateStatus(
                              report.id,
                              "processing"
                            )
                          }
                          className="rounded-xl bg-blue-500 px-3 py-2 text-white"
                        >
                          Xử lý
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              report.id,
                              "resolved"
                            )
                          }
                          className="rounded-xl bg-green-600 px-3 py-2 text-white"
                        >
                          Hoàn thành
                        </button>

                        <button
                          onClick={() =>
                            deleteReport(
                              report.id
                            )
                          }
                          className="rounded-xl bg-red-600 px-3 py-2 text-white"
                        >
                          Xóa
                        </button>

                      </div>
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-[2rem] border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}