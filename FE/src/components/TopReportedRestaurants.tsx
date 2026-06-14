import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Chay Sen",
    reports: 35,
  },
  {
    name: "An Lạc",
    reports: 25,
  },
  {
    name: "Bồ Đề",
    reports: 18,
  },
];

export default function TopReportedRestaurants() {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm border">
      <h3 className="font-bold text-xl mb-6">
        Top quán bị báo cáo
      </h3>

      <div className="h-[300px]">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="reports"
              fill="#10b981"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}