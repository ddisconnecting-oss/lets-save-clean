"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import BarChartComp from "@/app/components/BarChart";
import PieChartComp from "@/app/components/PieChart";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([
    { name: "Spotify", amount: 20, category: "Bills" },
  ]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const addExpense = () => {
    if (!name || !amount) return;

    setExpenses([
      ...expenses,
      { name, amount: Number(amount), category },
    ]);

    setName("");
    setAmount("");
  };

  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card">
            <p>Total Expenses</p>
            <h2 className="text-red-500">₱{totalExpenses}</h2>
          </div>
        </div>

        {/* ADD EXPENSE FORM */}
        <div className="card space-y-2">
          <h2>Add Expense</h2>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option>Food</option>
            <option>Bills</option>
            <option>Savings</option>
          </select>

          <button
            onClick={addExpense}
            className="bg-green-700 text-white px-4 py-2 rounded"
          >
            Add Expense
          </button>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-2 gap-4">
          <BarChartComp data={expenses} />
          <PieChartComp data={expenses} />
        </div>

        {/* LIST */}
        <div className="card">
          <h2>Expenses</h2>

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