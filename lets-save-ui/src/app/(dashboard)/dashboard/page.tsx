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
  const { user, isLoaded } = useUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // LOAD DATA
  const loadData = async () => {
    if (!user) return;

    const { data: tData, error: tError } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: cData, error: cError } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id);

    if (tError) console.error("Transactions error:", tError);
    if (cError) console.error("Categories error:", cError);

    setTransactions(tData || []);
    setCategories(cData?.map((c) => c.name) || []);
  };

  useEffect(() => {
    if (isLoaded && user) loadData();
  }, [isLoaded, user]);

  // ADD TRANSACTION
  const addTransaction = async () => {
    if (!name || !amount || !category || !user) return;

    const { error } = await supabase.from("expenses").insert([
      {
        name,
        amount: Number(amount),
        category,
        type,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return;
    }

    setName("");
    setAmount("");
    setCategory("");

    loadData();
  };

  // DELETE
  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) console.error(error);

    loadData();
  };

  // ➕ ADD CATEGORY
  const addCategory = async () => {
    if (!newCategory || !user) return;

    const { error } = await supabase.from("categories").insert([
      {
        name: newCategory,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    setNewCategory("");
    setShowModal(false);
    loadData();
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

  if (!isLoaded || !user)
    return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 max-w-6xl mx-auto space-y-6 overflow-x-hidden">

        <h1 className="text-3xl font-bold text-[#2f3e2c]">
          Dashboard
        </h1>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Income</p>
            <h2 className="text-green-600 text-xl font-bold">
              ₱{income}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <h2 className="text-red-500 text-xl font-bold">
              ₱{expenses}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Balance</p>
            <h2 className="text-xl font-bold">₱{balance}</h2>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <h2 className="font-semibold">Add Transaction</h2>

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
              className="bg-green-600 text-white px-3 rounded"
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

          <button
            onClick={addTransaction}
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
          >
            Add
          </button>
        </div>

        {/* PIE */}
        <div className="grid md:grid-cols-2 gap-4">
          {["expense", "income"].map((t, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold mb-2">
                {t === "expense" ? "Expenses" : "Income"}
              </h3>

              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData(t as any)} dataKey="value">
                      {pieData(t as any).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        {/* BAR */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Overview</h3>

          <div className="w-full h-[300px]">
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
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Transactions</h3>

          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex justify-between border-b py-2"
            >
              <span>
                {t.name} ({t.category})
              </span>

              <div className="flex gap-3">
                <span>₱{t.amount}</span>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-72 space-y-3">
              <h2>Add Category</h2>

              <input
                className="input"
                placeholder="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  onClick={addCategory}
                  className="bg-green-600 text-white px-3 py-1 rounded"
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