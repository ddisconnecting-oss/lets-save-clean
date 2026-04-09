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

      <div className="flex-1 p-10 space-y-8 max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-sm text-gray-500">Monthly Budget</p>
            <input
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="input mt-2"
            />
          </div>

          <div className="card">
            <p className="text-sm text-gray-500">Expenses</p>
            <h2 className="text-red-500 text-xl font-bold">
              ₱{totalExpenses}
            </h2>
          </div>

          <div className="card">
            <p className="text-sm text-gray-500">Balance</p>
            <h2
              className={`text-xl font-bold ${
                balance < 0 ? "text-red-500" : "text-green-700"
              }`}
            >
              ₱{balance}
            </h2>
          </div>
        </div>

        {/* ADD EXPENSE */}
        <div className="card space-y-3">
          <h2 className="font-semibold text-lg">Add Expense</h2>

          <input
            placeholder="Expense name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
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
            className="btn"
          >
            Add Expense
          </button>
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">
          <BarChartComp data={expenses} />
          <PieChartComp data={expenses} />
        </div>

        {/* EXPENSE LIST */}
        <div className="card">
          <h2 className="font-semibold mb-4 text-lg">Expenses</h2>

          {expenses.length === 0 && (
            <p className="text-gray-500">No expenses yet</p>
          )}

          {expenses.map((e: Expense, i: number) => (
            <div
              key={i}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-medium">{e.name}</p>
                <span className="text-sm text-gray-500">
                  {e.category}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold">₱{e.amount}</span>

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