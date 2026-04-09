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
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>(["Bills", "Needs"]);

  const [open, setOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  const [newCategory, setNewCategory] = useState("");

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Bills");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");

  useEffect(() => {
    const data = localStorage.getItem("items");
    const cat = localStorage.getItem("categories");

    if (data) setItems(JSON.parse(data));
    if (cat) setCategories(JSON.parse(cat));
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [items, categories]);

  const addItem = () => {
    if (!name || !amount || !date) return;
    setItems([...items, { name, amount, category, date, type }]);
    setOpen(false);
  };

  const addCategory = () => {
    if (!newCategory) return;
    setCategories([...categories, newCategory]);
    setOpenCategory(false);
  };

  const totalIncome = items.filter(i => i.type === "income").reduce((a,b)=>a+b.amount,0);
  const totalExpense = items.filter(i => i.type === "expense").reduce((a,b)=>a+b.amount,0);

  const chartData = items.map(i => ({
    amount: i.amount,
    type: i.type,
    createdAt: i.date,
    category: { name: i.category },
  }));

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">

        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Dashboard
        </h1>

        {/* CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl shadow-lg p-5">
            <p className="text-gray-500 text-sm">Total Income</p>
            <p className="text-green-600 font-bold text-xl">₱{totalIncome}</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl shadow-lg p-5">
            <p className="text-gray-500 text-sm">Total Expense</p>
            <p className="text-red-500 font-bold text-xl">₱{totalExpense}</p>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-green-200 rounded-2xl shadow-lg p-5">
            <p className="text-gray-500 text-sm">Transactions</p>
            <p className="font-bold text-xl">{items.length}</p>
          </div>

        </div>

        {/* GRAPH */}
        <div className="mb-6 bg-white/90 p-4 rounded-2xl shadow border border-green-200">
          <OverviewChart transactions={chartData} />
        </div>

        {/* PIE */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/90 p-4 rounded-2xl shadow border border-green-200">
            <PieChartBox transactions={chartData} type="income" />
          </div>
          <div className="bg-white/90 p-4 rounded-2xl shadow border border-green-200">
            <PieChartBox transactions={chartData} type="expense" />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md"
        >
          + Add Transaction
        </button>

      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-green-200 space-y-3">

            <input className="w-full border rounded-lg p-2" placeholder="Name" onChange={e=>setName(e.target.value)} />
            <input className="w-full border rounded-lg p-2" type="number" onChange={e=>setAmount(Number(e.target.value))} />
            <input className="w-full border rounded-lg p-2" type="date" onChange={e=>setDate(e.target.value)} />

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
              onClick={addItem}
            >
              Add
            </button>

          </div>
        </div>
      )}
    </div>
  );
}