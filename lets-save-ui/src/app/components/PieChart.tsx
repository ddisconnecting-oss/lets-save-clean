"use client";

import { PieChart, Pie, Tooltip } from "recharts";

const data = [
  { name: "Food", value: 400 },
  { name: "Bills", value: 300 },
  { name: "Savings", value: 200 },
];

export default function PieChartComp() {
  return (
    <div className="bg-slate-800 p-4 rounded-xl">
      <PieChart width={300} height={250}>
        <Pie data={data} dataKey="value" outerRadius={80} />
        <Tooltip />
      </PieChart>
    </div>
  );
}