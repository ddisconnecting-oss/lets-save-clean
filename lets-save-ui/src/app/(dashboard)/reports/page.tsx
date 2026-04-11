"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export default function Reports() {
  const { user } = useUser();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setData(data || []);
    };

    load();
  }, [user]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>

        <div className="card">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t">
                  <td>{item.name}</td>
                  <td>₱{item.amount}</td>
                  <td>{item.category}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}