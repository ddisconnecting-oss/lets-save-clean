"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Transaction = {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

const COLORS = ["#22c55e", "#16a34a", "#4ade80", "#15803d", "#166534"];

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState(["Food", "Bills", "Savings"]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState<"income" | "expense">("expense");

  // ✅ FAKE DATA LOAD (NO SUPABASE)
  useEffect(() => {
    setTransactions([
      {
        id: "1",
        name: "Salary",
        amount: 40000,
        category: "Income",
        type: "income",
      },
      {
        id: "2",
        name: "Food",
        amount: 500,
        category: "Food",
        type: "expense",
      },
      {
        id: "3",
        name: "Bills",
        amount: 1000,
        category: "Bills",
        type: "expense",
      },
    ]);
  }, []);

  // ADD
  const addTransaction = () => {
    if (!name || !amount) return;

    setTransactions([
      ...transactions,
      {
        id: Date.now().toString(),
        name,
        amount: Number(amount),
        category,
        type,
      },
    ]);

    setName("");
    setAmount("");
  };

  // DELETE
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // EDIT
  const editTransaction = (t: Transaction) => {
    setName(t.name);
    setAmount(String(t.amount));
    setCategory(t.category);
    setType(t.type);
    deleteTransaction(t.id);
  };

  // CATEGORY
  const addCategory = () => {
    const newCat = prompt("Enter new category:");
    if (!newCat) return;
    if (categories.includes(newCat)) return;
    setCategories([...categories, newCat]);
  };

  const deleteCategory = (cat: string) => {
    if (!confirm(`Delete ${cat}?`)) return;
    setCategories(categories.filter((c) => c !== cat));
  };

  // TOTALS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expenses;

  // BAR DATA
  const groupedBarData = Object.values(
    transactions.reduce((acc: any, t) => {
      if (!acc[t.name]) {
        acc[t.name] = { name: t.name, income: 0, expense: 0 };
      }

      if (t.type === "income") acc[t.name].income += t.amount;
      else acc[t.name].expense += t.amount;

      return acc;
    }, {})
  );

  // PIE DATA
  const groupPie = (type: "income" | "expense") => {
    const grouped: any = {};

    transactions
      .filter((t) => t.type === type)
      .forEach((t) => {
        if (!grouped[t.category]) grouped[t.category] = 0;
        grouped[t.category] += t.amount;
      });

    return Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));
  };

  const incomeData = groupPie("income");
  const expenseData = groupPie("expense");

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 overflow-x-hidden">
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card">
              <p>Total Income</p>
              <h2 className="text-green-600 font-bold">₱{income}</h2>
            </div>

            <div className="card">
              <p>Total Expenses</p>
              <h2 className="text-red-500 font-bold">₱{expenses}</h2>
            </div>

            <div className="card">
              <p>Balance</p>
              <h2 className="font-bold">₱{balance}</h2>
            </div>
          </div>

          {/* FORM */}
          <div className="card space-y-3">
            <h2>Add Transaction</h2>

            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />

            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c, i) => <option key={i}>{c}</option>)}
            </select>

            <select className="input" value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <button onClick={addTransaction} className="btn">Add</button>
            <button onClick={addCategory} className="btn">+ Add Category</button>
          </div>

          {/* CATEGORY LIST */}
          <div className="card">
            <h3>Categories</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((c, i) => (
                <div key={i} className="px-3 py-1 bg-green-100 rounded-full flex gap-2">
                  {c}
                  <button onClick={() => deleteCategory(c)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* PIE */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3>Expenses</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={expenseData} dataKey="value" outerRadius={80}>
                    {expenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3>Income</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={incomeData} dataKey="value" outerRadius={80}>
                    {incomeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BAR */}
          <div className="card">
            <h3>Financial Overview</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupedBarData}>
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="income" fill="#22c55e" />
                  <Bar dataKey="expense" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LIST */}
          <div className="card">
            <h3>Transactions</h3>

            {transactions.map((t) => (
              <div key={t.id} className="flex justify-between border-b py-2">
                <span>{t.name} ({t.category})</span>

                <div className="flex gap-3">
                  <span>₱{t.amount}</span>
                  <button onClick={() => editTransaction(t)}>✏️</button>
                  <button onClick={() => deleteTransaction(t.id)}>❌</button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}