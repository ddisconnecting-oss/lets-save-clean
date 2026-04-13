"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import {
  BarChart, Bar, XAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

type Transaction = {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

const EXPENSE_COLORS = ["#ef4444","#dc2626","#f87171","#b91c1c","#7f1d1d"];
const INCOME_COLORS = ["#22c55e","#16a34a","#4ade80","#15803d","#166534"];

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [type, setType] = useState<"income"|"expense">("expense");

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    if (!user) return;

    const { data: tData } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at",{ascending:false});

    const { data: cData } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", user.id);

    setTransactions(tData || []);
    setCategories(cData?.map(c=>c.name) || []);
  };

  useEffect(()=>{
    if(isLoaded && user) loadData();
  },[isLoaded,user]);

  const addTransaction = async () => {
    if(!name || !amount || !category || !user) return;

    await supabase.from("expenses").insert([
      {
        name,
        amount:Number(amount),
        category,
        type,
        user_id:user.id
      }
    ]);

    setName("");
    setAmount("");
    setCategory("");
    loadData();
  };

  const deleteTransaction = async (id:string)=>{
    await supabase.from("expenses").delete().eq("id",id);
    loadData();
  };

  const addCategory = async () => {
    if(!newCategory || !user) return;

    await supabase.from("categories").insert([
      { name:newCategory, user_id:user.id }
    ]);

    setNewCategory("");
    setShowModal(false);
    loadData();
  };

  const removeCategory = async (cat:string)=>{
    if(!user) return;

    await supabase.from("expenses")
      .delete()
      .eq("user_id",user.id)
      .eq("category",cat);

    await supabase.from("categories")
      .delete()
      .eq("user_id",user.id)
      .eq("name",cat);

    loadData();
  };

  const income = transactions.filter(t=>t.type==="income").reduce((a,b)=>a+b.amount,0);
  const expenses = transactions.filter(t=>t.type==="expense").reduce((a,b)=>a+b.amount,0);
  const balance = income - expenses;

  const barData = Object.values(
    transactions.reduce((acc:any,t)=>{
      if(!acc[t.category]){
        acc[t.category]={name:t.category,income:0,expense:0};
      }
      if(t.type==="income") acc[t.category].income+=t.amount;
      else acc[t.category].expense+=t.amount;
      return acc;
    },{})
  );

  const pieData = (type:"income"|"expense")=>{
    const grouped:any={};
    transactions.filter(t=>t.type===type).forEach(t=>{
      if(!grouped[t.category]) grouped[t.category]=0;
      grouped[t.category]+=t.amount;
    });
    return Object.keys(grouped).map(k=>({name:k,value:grouped[k]}));
  };

  const filteredCategories = categories.filter(c =>
    c.toLowerCase().includes(category.toLowerCase())
  );

  if(!isLoaded || !user) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex bg-gradient-to-br from-[#f5efe6] to-[#e6f4ea] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 max-w-7xl mx-auto space-y-8">

        <div className="grid md:grid-cols-3 gap-6">
          {[ 
            {label:"Income",value:income,color:"text-green-600"},
            {label:"Expenses",value:expenses,color:"text-red-500"},
            {label:"Balance",value:balance,color:"text-[#2f3e2c]"},
          ].map((c,i)=>(
            <div key={i} className="bg-white/70 p-6 rounded-2xl shadow-md">
              <p className="text-sm text-gray-500">{c.label}</p>
              <h2 className={`text-3xl font-bold ${c.color}`}>
                ₱{c.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="bg-white/70 p-6 rounded-2xl shadow-md space-y-4">
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />

          <div ref={wrapperRef} className="relative">
            <input
              className="input"
              placeholder="Search or type category"
              value={category}
              onChange={(e)=>{
                setCategory(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={()=>setShowSuggestions(true)}
            />

            {showSuggestions && (
              <div className="absolute w-full bg-white shadow-md rounded-xl mt-1 max-h-40 overflow-y-auto z-10">
                {filteredCategories.map((c,i)=>(
                  <div
                    key={i}
                    onClick={()=>{
                      setCategory(c);
                      setShowSuggestions(false);
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={()=>setShowModal(true)} className="text-green-700 font-semibold">
            + Add new category
          </button>

          <select className="input" value={type} onChange={(e)=>setType(e.target.value as any)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button onClick={addTransaction} className="w-full bg-green-700 text-white py-2 rounded-xl">
            Add Transaction
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="md:col-span-2 bg-white/70 p-6 rounded-2xl shadow-md">
            <h3 className="mb-4 font-semibold">Overview</h3>
            <ResponsiveContainer height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name"/>
                <Tooltip/>
                <Bar dataKey="income" fill="#22c55e"/>
                <Bar dataKey="expense" fill="#ef4444"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-6">

            {/* EXPENSE PIE */}
            <div className="bg-white/70 p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="font-semibold">Expenses Breakdown</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">₱{expenses}</p>

              <ResponsiveContainer height={150}>
                <PieChart>
                  <Pie data={pieData("expense")} dataKey="value">
                    {pieData("expense").map((_,i)=>
                      <Cell key={i} fill={EXPENSE_COLORS[i % EXPENSE_COLORS.length]}/>
                    )}
                  </Pie>
                  <Tooltip formatter={(value:any,name:any)=>[`₱${value}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* INCOME PIE */}
            <div className="bg-white/70 p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <h3 className="font-semibold">Income Breakdown</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">₱{income}</p>

              <ResponsiveContainer height={150}>
                <PieChart>
                  <Pie data={pieData("income")} dataKey="value">
                    {pieData("income").map((_,i)=>
                      <Cell key={i} fill={INCOME_COLORS[i % INCOME_COLORS.length]}/>
                    )}
                  </Pie>
                  <Tooltip formatter={(value:any,name:any)=>[`₱${value}`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

        <div className="bg-white/70 p-6 rounded-2xl shadow-md">
          <h3 className="mb-4 font-semibold">Recent Activity</h3>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {transactions.map((t)=>(
              <div key={t.id} className="flex justify-between p-3 hover:bg-gray-100 rounded-xl">
                <div>
                  <p>{t.name}</p>
                  <p className="text-xs text-gray-500">{t.category}</p>
                </div>

                <div className="flex gap-3">
                  <span className={t.type==="income"?"text-green-600":"text-red-500"}>
                    ₱{t.amount}
                  </span>
                  <button onClick={()=>deleteTransaction(t.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl space-y-4">
              <h2>Add Category</h2>

              <input
                className="input"
                value={newCategory}
                onChange={(e)=>setNewCategory(e.target.value)}
              />

              <div className="flex gap-2">
                <button onClick={()=>setShowModal(false)}>Cancel</button>
                <button onClick={addCategory}>Add</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}