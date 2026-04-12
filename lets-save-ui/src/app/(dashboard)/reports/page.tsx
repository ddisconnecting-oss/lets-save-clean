"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  created_at: string;
};

export default function Reports() {
  const [data, setData] = useState<Expense[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setData(data || []);
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f5efe6]">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#2f3e2c]">Reports</h1>

        <div className="bg-[#d6e3c5] rounded-xl p-4 shadow-md">
          
          {/* TABLE HEADER */}
          <div className="grid grid-cols-5 font-semibold border-b pb-2 mb-2">
            <span>Name</span>
            <span>Category</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Time</span>
          </div>

          {/* SCROLLABLE TABLE */}
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {data.map((item) => {
              const date = new Date(item.created_at);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-5 bg-white p-2 rounded-md"
                >
                  <span>{item.name}</span>
                  <span>{item.category}</span>
                  <span>₱{item.amount}</span>
                  <span>{date.toLocaleDateString()}</span>
                  <span>{date.toLocaleTimeString()}</span>
                </div>
              );
            })}

            {data.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No data yet
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}