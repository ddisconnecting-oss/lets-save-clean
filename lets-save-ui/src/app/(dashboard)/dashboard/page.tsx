"use client";

import Sidebar from "@/components/Sidebar";
import BarChartComp from "@/components/BarChart";
import PieChartComp from "@/components/PieChart";

export default function Dashboard() {
  const expenses = [
    { name: "Spotify", amount: 20 },
    { name: "Food", amount: 50 },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl">
            <p>Total Income</p>
            <h2 className="text-green-400">₱40,000</h2>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p>Total Expenses</p>
            <h2 className="text-red-400">₱6,948</h2>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl">
            <p>Balance</p>
            <h2 className="text-green-400">₱33,752</h2>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-2 gap-4">
          <BarChartComp />
          <PieChartComp />
        </div>

        {/* EXPENSE LIST */}
        <div className="bg-slate-800 p-4 rounded-xl">
          <h2 className="mb-2">Expenses</h2>

          {expenses.map((e, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span>{e.name}</span>
              <span>₱{e.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}