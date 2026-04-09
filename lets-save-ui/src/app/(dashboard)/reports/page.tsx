"use client";

import Sidebar from "@/components/Sidebar";
import { useExpenses } from "@/context/ExpenseContext";

type Expense = {
  name: string;
  amount: number;
  category: string;
};

export default function Reports() {
  const { expenses } = useExpenses();

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10 max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Reports</h1>

        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length === 0 && (
                <tr>
                  <td className="p-3 text-gray-500" colSpan={3}>
                    No data yet
                  </td>
                </tr>
              )}

              {expenses.map((e: Expense, i: number) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{e.name}</td>
                  <td>₱{e.amount}</td>
                  <td>{e.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}