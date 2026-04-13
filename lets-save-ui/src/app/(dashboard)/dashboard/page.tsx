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

  const loadData = async () => {
    if (!user) return;

    const { data: tData } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: cData } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id);

    setTransactions(tData || []);
    setCategories(cData?.map((c) => c.name) || []);
  };

  useEffect(() => {
    if (isLoaded && user) loadData();
  }, [isLoaded, user]);

  const addTransaction = async () => {
    if (!name || !amount || !category || !user) return;

    await supabase.from("expenses").insert([
      {
        name,
        amount: Number(amount),
        category,
        type,
        user_id: user.id,
      },
    ]);

    setName("");
    setAmount("");
    setCategory("");
    loadData();
  };

  const deleteTransaction = async (id: string) => {
    await supabase.from("expenses").delete().eq("id", id);
    loadData();
  };

  const addCategory = async () => {
    if (!newCategory || !user) return;

    await supabase.from("categories").insert([
      { name: newCategory, user_id: user.id },
    ]);

    setNewCategory("");
    setShowModal(false);
    loadData();
  };

  const removeCategory = async (cat: string) => {
    if (!user) return;

    await supabase
      .from("expenses")
      .delete()
      .eq("user_id", user.id)
      .eq("category", cat);

    await supabase
      .from("categories")
      .delete()
      .eq("user_id", user.id)
      .eq("name", cat);

    loadData();
  };

  const income = transactions.filter(t => t.type === "income").reduce((a,b)=>a+b.amount,0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((a,b)=>a+b.amount,0);
  const balance = income - expenses;

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

  if (!isLoaded || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex bg-gradient-to-br from-[#f5efe6] to-[#e6f4ea] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-[#2f3e2c]">Dashboard</h1>
          <p className="text-gray-500 text-sm">Track your finances</p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { label: "Income", value: income, color: "text-green-600" },
            { label: "Expenses", value: expenses, color: "text-red-500" },
            { label: "Balance", value: balance, color: "text-[#2f3e2c]" },
          ].map((c, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md">
              <p className="text-sm text-gray-500">{c.label}</p>
              <h2 className={`text-3xl font-bold ${c.color}`}>₱{c.value}</h2>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md space-y-3">
          <h2 className="font-semibold text-lg">Add Transaction</h2>

          <input className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />

          <div className="flex gap-2">
            <select className="input flex-1" value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c,i)=><option key={i}>{c}</option>)}
            </select>

            <button onClick={()=>setShowModal(true)} className="bg-green-600 text-white px-3 rounded-lg hover:scale-105 transition">
              +
            </button>
          </div>

          {/* CATEGORY TAGS */}
          <div className="flex flex-wrap gap-2">
            {categories.map((c,i)=>(
              <div key={i} className="flex items-center bg-gray-200 px-3 py-1 rounded-full">
                <span className="mr-2 text-sm">{c}</span>
                <button onClick={()=>removeCategory(c)} className="text-red-500 text-xs">✕</button>
              </div>
            ))}
          </div>

          <select className="input" value={type} onChange={(e)=>setType(e.target.value as any)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button onClick={addTransaction} className="bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800">
            Add
          </button>
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md">
            <h3 className="mb-3">Overview</h3>
            <div className="h-[300px]">
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

          <div className="flex flex-col gap-5">
            <div className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-md">
              <h3>Expenses</h3>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData("expense")} dataKey="value">
                      {pieData("expense").map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-md">
              <h3>Income</h3>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData("income")} dataKey="value">
                      {pieData("income").map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md">
          <h3 className="mb-3">Recent Transactions</h3>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {transactions.length > 0 ? (
              transactions.map((t)=>(
                <div key={t.id} className="flex justify-between p-3 hover:bg-white/80 rounded-xl">
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.category}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={t.type === "income" ? "text-green-600" : "text-red-500"}>
                      ₱{t.amount}
                    </span>
                    <button onClick={()=>deleteTransaction(t.id)} className="text-red-500">✕</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No transactions yet</p>
            )}
          </div>
        </div>

        {/* MODERN MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 w-[320px] space-y-4">
              <h2 className="text-lg font-semibold">Add Category</h2>

              <input
                className="w-full border px-4 py-2 rounded-lg"
                placeholder="e.g. Food"
                value={newCategory}
                onChange={(e)=>setNewCategory(e.target.value)}
              />

              <div className="flex justify-end gap-2">
                <button onClick={()=>setShowModal(false)} className="px-3 py-2">Cancel</button>
                <button onClick={addCategory} className="bg-green-700 text-white px-3 py-2 rounded-lg">
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