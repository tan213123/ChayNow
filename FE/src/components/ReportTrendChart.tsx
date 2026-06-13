import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", reports: 12 },
  { month: "Feb", reports: 20 },
  { month: "Mar", reports: 28 },
  { month: "Apr", reports: 24 },
  { month: "May", reports: 38 },
  { month: "Jun", reports: 45 },
];

export default function ReportTrendChart() {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm border">
      <h3 className="font-bold text-xl mb-6">
        Báo cáo theo tháng
      </h3>

      <div className="h-[350px]">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="reports"
              stroke="#10b981"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}