"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export default function PieChartBox({ transactions, type }: any) {
  const filtered = transactions.filter((t: any) => t.type === type);

  const grouped: any = {};

  filtered.forEach((t: any) => {
    const name = t.category?.name || "Other";

    if (!grouped[name]) grouped[name] = 0;
    grouped[name] += t.amount;
  });

  const data = Object.keys(grouped).map((key) => ({
    name: key,
    value: grouped[key],
  }));

  return (
    <div className="w-full h-80 bg-white p-4 rounded-xl shadow flex flex-col">
      <h2 className="text-sm font-semibold mb-2 capitalize">
        {type} Breakdown
      </h2>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={40} 
              paddingAngle={3}
            >
              {data.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}