"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

type Transaction = {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: string;
};

export default function Reports() {
  const { user } = useUser();
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("REPORT ERROR:", error.message);
        setData([]);
        return;
      }

      setData(data ?? []);
    };

    load();
  }, [user]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>

        <div className="card">
          {data.length === 0 && <p>No data yet</p>}

          {data.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <span>
                {item.name} ({item.category})
              </span>
              <span>₱{item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}