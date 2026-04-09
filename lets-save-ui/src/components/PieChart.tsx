"use client";

import { PieChart, Pie, Tooltip } from "recharts";

export default function PieChartComp({ data }: any) {
  return (
    <div className="card">
      <PieChart width={300} height={250}>
        <Pie data={data} dataKey="amount" nameKey="category" outerRadius={80} />
        <Tooltip />
      </PieChart>
    </div>
  );
}