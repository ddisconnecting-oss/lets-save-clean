"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function OverviewChart({ transactions }: any) {
  const grouped: any = {};


for (let i = 1; i <= 30; i++) {
  grouped[i] = { date: i.toString(), income: 0, expense: 0 };
}


transactions.forEach((t: any) => {
  const day = new Date(t.createdAt).getDate();

  if (t.type === "income") {
    grouped[day].income += t.amount;
  } else {
    grouped[day].expense += t.amount;
  }
});


const data = Object.values(grouped);

  return (
    <div className="w-full h-80 bg-white p-4 rounded-xl shadow">
      <h2 className="text-sm font-semibold mb-2">Overview</h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />
          <YAxis />

          <Tooltip />
          <Legend />

          <Bar dataKey="income" fill="#22c55e" barSize={8} />
          <Bar dataKey="expense" fill="#ef4444" barSize={8} />
          
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}