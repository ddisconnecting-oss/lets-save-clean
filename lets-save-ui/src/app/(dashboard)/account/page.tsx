"use client";

import Sidebar from "@/components/Sidebar";

export default function Account() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <h1 className="text-2xl font-bold">Account</h1>
        <p>Settings coming soon</p>
      </div>
    </div>
  );
}