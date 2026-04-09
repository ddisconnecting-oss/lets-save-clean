"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useExpenses } from "@/context/ExpenseContext";
import BarChartComp from "@/components/BarChart";
import PieChartComp from "@/components/PieChart";

type Expense = {
  name: string;
  amount: number;
  category: string;
};

export default function Dashboard() {
  const { expenses, addExpense, deleteExpense, budget, setBudget } = useExpenses();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const totalExpenses = expenses.reduce(
    (a: number, b: Expense) => a + b.amount,
    0
  );

  const balance = budget - totalExpenses;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 space-y-6">

        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card">
            <p>Budget</p>
            <input
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="border p-2 w-full rounded"
            />
          </div>

          <div className="card">
            <p>Expenses</p>
            <h2 className="text-red-500">₱{totalExpenses}</h2>
          </div>

          <div className="card">
            <p>Balance</p>
            <h2 className={balance < 0 ? "text-red-500" : "text-green-600"}>
              ₱{balance}
            </h2>
          </div>
        </div>

        {/* ADD EXPENSE */}
        <div className="card space-y-3">
          <h2 className="font-semibold">Add Expense</h2>

          <input
            placeholder="Expense name"
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
            onClick={() => {
              if (!name || !amount) return;

              addExpense({
                name,
                amount: Number(amount),
                category,
              });

              setName("");
              setAmount("");
            }}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
          >
            Add Expense
          </button>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BarChartComp data={expenses} />
          <PieChartComp data={expenses} />
        </div>

        {/* EXPENSE LIST */}
        <div className="card">
          <h2 className="font-semibold mb-2">Expenses</h2>

          {expenses.length === 0 && (
            <p className="text-gray-500">No expenses yet</p>
          )}

          {expenses.map((e: Expense, i: number) => (
            <div
              key={i}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p>{e.name}</p>
                <span className="text-sm text-gray-500">{e.category}</span>
              </div>

              <div className="flex items-center gap-3">
                <span>₱{e.amount}</span>
                <button
                  onClick={() => deleteExpense(i)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}