"use client";

import { useState } from "react";
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
import { motion } from "framer-motion";

type Transaction = {
  name: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

const COLORS = [
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#15803d",
  "#166534",
  "#84cc16",
];

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState(["Food", "Bills", "Savings"]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState<"income" | "expense">("expense");

  const [newCategory, setNewCategory] = useState("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // ADD CATEGORY
  const addCategory = () => {
    if (!newCategory) return;
    setCategories([...categories, newCategory]);
    setNewCategory("");
  };

  // ADD TRANSACTION
  const addTransaction = () => {
    if (!name || !amount) return;

    if (editingIndex !== null) {
      const updated = [...transactions];
      updated[editingIndex] = {
        name,
        amount: Number(amount),
        category,
        type,
      };
      setTransactions(updated);
      setEditingIndex(null);
    } else {
      setTransactions([
        ...transactions,
        {
          name,
          amount: Number(amount),
          category,
          type,
        },
      ]);
    }

    setName("");
    setAmount("");
  };

  const deleteTransaction = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const editTransaction = (index: number) => {
    const t = transactions[index];
    setName(t.name);
    setAmount(String(t.amount));
    setCategory(t.category);
    setType(t.type);
    setEditingIndex(index);
  };

  // totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expenses;

  // group data
  const groupData = (type: "income" | "expense") => {
    const filtered = transactions.filter((t) => t.type === type);

    const grouped: any = {};

    filtered.forEach((t) => {
      if (!grouped[t.category]) grouped[t.category] = 0;
      grouped[t.category] += t.amount;
    });

    return Object.keys(grouped).map((key) => ({
      name: key,
      value: grouped[key],
    }));
  };

  const expenseData = groupData("expense");
  const incomeData = groupData("income");

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10 space-y-8 max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* TOP CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.03 }} className="card">
            <p>Total Income</p>
            <h2 className="text-green-600 text-xl font-bold">₱{income}</h2>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="card">
            <p>Total Expenses</p>
            <h2 className="text-red-500 text-xl font-bold">₱{expenses}</h2>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="card">
            <p>Balance</p>
            <h2 className="text-xl font-bold">₱{balance}</h2>
          </motion.div>
        </div>

        {/* FORM */}
        <div className="card space-y-3">
          <h2 className="font-semibold">Add / Edit Transaction</h2>

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
            {categories.map((c, i) => (
              <option key={i}>{c}</option>
            ))}
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
            {editingIndex !== null ? "Update" : "Add"}
          </button>

          {/* ADD CATEGORY */}
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={addCategory} className="btn">
              Add Category
            </button>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="card">
            <h3>Expenses</h3>
            <PieChart width={300} height={250}>
              <Pie data={expenseData} dataKey="value" outerRadius={90}>
                {expenseData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="card">
            <h3>Income</h3>
            <PieChart width={300} height={250}>
              <Pie data={incomeData} dataKey="value" outerRadius={90}>
                {incomeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* BAR */}
        <div className="card">
          <h3>Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactions}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="amount" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LIST */}
        <div className="card">
          <h3>Transactions</h3>

          {transactions.map((t, i) => (
            <div key={i} className="flex justify-between py-2 border-b">
              <span>{t.name} ({t.category})</span>

              <div className="flex gap-3">
                <span>₱{t.amount}</span>

                <button onClick={() => editTransaction(i)}>✏️</button>
                <button onClick={() => deleteTransaction(i)}>❌</button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}