import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Spam",
    value: 40,
  },
  {
    name: "Review giả",
    value: 25,
  },
  {
    name: "Phản cảm",
    value: 20,
  },
  {
    name: "Khác",
    value: 15,
  },
];

export default function ReportTypeChart() {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm border">
      <h3 className="font-bold text-xl mb-6">
        Loại báo cáo
      </h3>

      <div className="h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}