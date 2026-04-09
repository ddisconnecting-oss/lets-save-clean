"use client";

import { useState } from "react";
import Chart from "@/components/Chart";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([
    { name: "Spotify", amount: 20 },
    { name: "Food", amount: 50 },
  ]);

  return (
    <div className="flex">
      <Sidebar />

      <main className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* CHART */}
        <Chart />

        {/* MONTH LIMIT */}
        <div className="bg-black text-green-400 p-4 rounded-xl mt-4 w-[200px]">
          <p>Monthly Limit</p>
          <h2 className="text-2xl">₱ 0.00</h2>
        </div>

        {/* EXPENSE LIST */}
        <div className="mt-6">
          {expenses.map((e, i) => (
            <div key={i} className="flex justify-between bg-white p-3 rounded mb-2">
              <span>{e.name}</span>
              <span>₱{e.amount}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}