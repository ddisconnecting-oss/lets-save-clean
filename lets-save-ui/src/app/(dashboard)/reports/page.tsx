"use client";

import Sidebar from "@/app/components/Sidebar"

export default function Reports() {
  const data = [
    { time: "10:00", date: "May 1", amount: 20, category: "Food" },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-xl font-bold mb-4">Reports</h1>

        <table className="w-full bg-slate-800 rounded-xl">
          <thead>
            <tr className="text-left">
              <th className="p-2">Time</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td className="p-2">{d.time}</td>
                <td>{d.date}</td>
                <td>₱{d.amount}</td>
                <td>{d.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}