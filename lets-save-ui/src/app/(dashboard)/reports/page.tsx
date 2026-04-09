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

      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-xl font-bold">Reports</h1>

        <div className="card overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="p-2">Name</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length === 0 && (
                <tr>
                  <td className="p-2 text-gray-500" colSpan={3}>
                    No data yet
                  </td>
                </tr>
              )}

              {expenses.map((e: Expense, i: number) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{e.name}</td>
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