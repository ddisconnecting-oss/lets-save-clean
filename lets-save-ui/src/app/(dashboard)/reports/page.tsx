"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@clerk/nextjs";

type Expense = {
  id: number;
  name: string;
  amount: number;
  category: string;
  created_at: string;
};

export default function Reports() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<Expense[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id) // ✅ FIX: filter per user
        .order("created_at", { ascending: false });

      if (!error) setData(data || []);
    };

    if (isLoaded) load();
  }, [user, isLoaded]);

  // ⏳ loading state
  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f5efe6] to-[#e6f4ea]">
      <Sidebar />

      <main className="flex-1 p-8 max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-[#2f3e2c]">
          Reports
        </h1>

        {/* TABLE CONTAINER */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 shadow-md">

          {/* HEADER */}
          <div className="grid grid-cols-5 text-sm font-semibold text-gray-600 border-b pb-2 mb-3">
            <span>Name</span>
            <span>Category</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Time</span>
          </div>

          {/* SCROLLABLE LIST */}
          <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">

            {data.map((item) => {
              const date = new Date(item.created_at);

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-5 items-center bg-white/80 p-3 rounded-xl hover:shadow-md hover:scale-[1.01] transition"
                >
                  <span className="font-medium">
                    {item.name}
                  </span>

                  <span className="text-gray-600">
                    {item.category}
                  </span>

                  <span className="font-semibold text-[#2f3e2c]">
                    ₱{item.amount}
                  </span>

                  <span className="text-gray-500 text-sm">
                    {date.toLocaleDateString()}
                  </span>

                  <span className="text-gray-400 text-sm">
                    {date.toLocaleTimeString()}
                  </span>
                </div>
              );
            })}

            {data.length === 0 && (
              <p className="text-center text-gray-500 mt-6">
                No transactions yet
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}