import CountUp from "react-countup";
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

  const cards = [
    {
      title: "Tổng báo cáo",
      value: reports.length,
      icon: AlertTriangle,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Chưa xử lý",
      value: pending,
      icon: Clock3,
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      title: "Đang xử lý",
      value: processing,
      icon: ShieldAlert,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Hoàn thành",
      value: resolved,
      icon: CheckCircle,
      bg: "bg-green-100",
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {cards.map((item) => (
        <div
          key={item.title}
          className="rounded-[2rem] bg-white p-6 shadow-sm border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {item.title}
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                <CountUp end={item.value} />
              </h2>
            </div>

            <div
              className={`${item.bg} rounded-2xl p-4`}
            >
              <item.icon
                className={`h-7 w-7 ${item.color}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}