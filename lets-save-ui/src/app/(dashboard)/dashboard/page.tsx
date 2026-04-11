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
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState<"income" | "expense">("expense");

  // 🔥 LOAD DATA FROM SUPABASE
  const loadTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    if (data) setTransactions(data);
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  // ➕ ADD
  const addTransaction = async () => {
    if (!name || !amount || !user) return;

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
      console.error(error);
      return;
    }

    setName("");
    setAmount("");
    loadTransactions();
  };

  // ❌ DELETE
  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadTransactions();
  };

  // 📊 TOTALS
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + Number(b.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + Number(b.amount), 0);

  const balance = income - expenses;

  // 📊 BAR DATA
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

  // 🥧 PIE DATA
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

          {/* 💰 CARDS */}
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

          {/* ➕ ADD FORM */}
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

            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Food</option>
              <option>Bills</option>
              <option>Savings</option>
              <option>Income</option>
            </select>

            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <button onClick={addTransaction} className="btn">
              Add Transaction
            </button>
          </div>

          {/* 📊 PIE CHARTS */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3>Expenses</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={expenseData} dataKey="value" outerRadius={80}>
                    {expenseData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
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
                    {incomeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 📊 BAR CHART */}
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

          {/* 📋 LIST */}
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

        </div>
      </div>
    </div>
  );
}