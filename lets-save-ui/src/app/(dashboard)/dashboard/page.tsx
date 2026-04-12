"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
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
  const { user } = useUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const [categories, setCategories] = useState(["Food", "Bills", "Savings"]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // LOAD DATA
  const loadTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("FETCH ERROR:", error.message);
      return;
    }

    setTransactions(data || []);
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  // ADD
  const addTransaction = async () => {
    if (!name || !amount || !category || !user) return;

    const { error } = await supabase.from("transactions").insert([
      {
        name,
        amount: Number(amount),
        category,
        type,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("INSERT ERROR:", error.message);
      return;
    }

    setName("");
    setAmount("");
    setCategory("");

    await loadTransactions();
  };

  // DELETE
  const deleteTransaction = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id);
    loadTransactions();
  };

  // CALCULATIONS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expenses;

  // BAR DATA
  const barData = Object.values(
    transactions.reduce((acc: any, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { name: t.category, income: 0, expense: 0 };
      }

      if (t.type === "income") acc[t.category].income += t.amount;
      else acc[t.category].expense += t.amount;

      return acc;
    }, {})
  );

  // PIE DATA
  const pieData = (type: "income" | "expense") => {
    const grouped: any = {};

    transactions
      .filter((t) => t.type === type)
      .forEach((t) => {
        if (!grouped[t.category]) grouped[t.category] = 0;
        grouped[t.category] += t.amount;
      });

    return Object.keys(grouped).map((k) => ({
      name: k,
      value: grouped[k],
    }));
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 max-w-6xl mx-auto space-y-6 overflow-x-hidden">

        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <p>Total Income</p>
            <h2 className="text-green-600">₱{income}</h2>
          </div>

          <div className="card">
            <p>Total Expenses</p>
            <h2 className="text-red-500">₱{expenses}</h2>
          </div>

          <div className="card">
            <p>Balance</p>
            <h2>₱{balance}</h2>
          </div>
        </div>

        {/* FORM */}
        <div className="card space-y-3">
          <h2>Add Transaction</h2>

          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div className="flex gap-2">
            <select
              className="input flex-1"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c, i) => (
                <option key={i}>{c}</option>
              ))}
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="btn bg-green-600"
            >
              +
            </button>
          </div>

          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button onClick={addTransaction} className="btn">
            Add
          </button>
        </div>

        {/* PIE CHARTS */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <h3>Expenses</h3>
            <div className="h-62.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData("expense")} dataKey="value">
                    {pieData("expense").map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3>Income</h3>
            <div className="h-62.5 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData("income")} dataKey="value">
                    {pieData("income").map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BAR */}
        <div className="card">
          <h3>Overview</h3>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
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

          {transactions.length === 0 && <p>No data yet</p>}

          {transactions.map((t) => (
            <div key={t.id} className="flex justify-between border-b py-2">
              <span>
                {t.name} ({t.category})
              </span>

              <div className="flex gap-3">
                <span>₱{t.amount}</span>
                <button onClick={() => deleteTransaction(t.id)}>❌</button>
              </div>
            </div>
          ))}
        </div>

        {/* CATEGORY MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-75 space-y-3">
              <h2 className="font-bold">Add Category</h2>

              <input
                className="input"
                placeholder="Category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    if (!newCategory) return;

                    setCategories([...categories, newCategory]);
                    setCategory(newCategory);
                    setNewCategory("");
                    setShowModal(false);
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}