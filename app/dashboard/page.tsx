"use client";

import OverviewChart from "./_components/charts/OverviewChart";
import PieChartBox from "./_components/charts/PieChartBox";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Layout/Sidebar";

type Item = {
  name: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
};

export default function DashboardPage() {
  // ================= STATE =================
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>(["Bills", "Needs"]);
  const [limit, setLimit] = useState(0);

  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  // FORM
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Bills");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  // ================= STORAGE =================
  useEffect(() => {
    const data = localStorage.getItem("items");
    const cat = localStorage.getItem("categories");
    const lim = localStorage.getItem("limit");

    if (data) setItems(JSON.parse(data));
    if (cat) setCategories(JSON.parse(cat));
    if (lim) setLimit(Number(lim));
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("limit", String(limit));
  }, [items, categories, limit]);

  // ================= ADD =================
  const addItem = () => {
    if (!name || !amount || !date) return;

    setItems([...items, { name, amount, category, date, type }]);

    setOpen(false);
    setName("");
    setAmount(0);
  };

  // ================= CATEGORY =================
  const addCategory = () => {
    if (!newCategory) return;

    setCategories([...categories, newCategory]);
    setNewCategory("");
    setOpenCategory(false);
  };

  const deleteCategory = (cat: string) => {
    setCategories(categories.filter((c) => c !== cat));
    setItems(items.filter((i) => i.category !== cat));
  };

  // ================= DELETE =================
  const deleteItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // ================= TOTALS =================
  const totalIncome = items
    .filter((i) => i.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = items
    .filter((i) => i.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  // ================= CHART DATA =================
  const chartData = items.map((i) => ({
    amount: i.amount,
    type: i.type,
    createdAt: i.date,
    category: { name: i.category },
  }));

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#e6f7ec] to-[#b7e4c7]">
      <Sidebar />

      <div className="flex-1 p-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Dashboard
        </h1>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white/70 backdrop-blur-md border border-green-200 rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ₱{totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-green-200 rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-red-500">
              ₱{totalExpense.toLocaleString()}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-green-200 rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">Monthly Limit</p>
            <p className="text-2xl font-bold text-green-700">
              ₱{limit}
            </p>
          </div>

        </div>

        {/* GRAPH */}
        <div className="mb-6">
          <OverviewChart transactions={chartData} />
        </div>

        {/* PIE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <PieChartBox transactions={chartData} type="income" />
          <PieChartBox transactions={chartData} type="expense" />
        </div>

        {/* LOWER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* CATEGORIES */}
          <div className="bg-white/80 backdrop-blur-md border border-green-200 rounded-2xl p-4 shadow">
            <h3 className="font-semibold text-green-800 mb-2">Categories</h3>

            {categories.map((c) => (
              <div key={c} className="flex justify-between mb-1 text-sm">
                {c}
                <button onClick={() => deleteCategory(c)}>❌</button>
              </div>
            ))}

            <button
              className="mt-3 text-green-600 font-medium"
              onClick={() => setOpenCategory(true)}
            >
              + Add Category
            </button>
          </div>

          {/* TRANSACTIONS */}
          <div className="bg-white/80 backdrop-blur-md border border-green-200 rounded-2xl p-4 shadow">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold text-green-800">Transactions</h3>
              <button onClick={() => setOpen(true)}>+ Add</button>
            </div>

            {items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm mb-1">
                {i.name} ₱{i.amount}
                <button onClick={() => deleteItem(idx)}>❌</button>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* TRANSACTION MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[350px] p-6 space-y-4">

            <h2 className="text-lg font-semibold text-green-800">
              Add Transaction
            </h2>

            <input className="w-full border rounded-lg p-2" placeholder="Name" onChange={(e)=>setName(e.target.value)} />
            <input className="w-full border rounded-lg p-2" type="number" placeholder="Amount" onChange={(e)=>setAmount(Number(e.target.value))} />
            <input className="w-full border rounded-lg p-2" type="date" onChange={(e)=>setDate(e.target.value)} />

            <select className="w-full border rounded-lg p-2" onChange={(e)=>setCategory(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>

            <select className="w-full border rounded-lg p-2" onChange={(e)=>setType(e.target.value as any)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={addItem}>Add</button>
            </div>

          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {openCategory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[320px] p-6 space-y-4">

            <h2 className="text-lg font-semibold text-green-800">
              Add Category
            </h2>

            <input
              className="w-full border rounded-lg p-2"
              placeholder="Category name"
              value={newCategory}
              onChange={(e)=>setNewCategory(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded-lg" onClick={()=>setOpenCategory(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={addCategory}>Add</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}