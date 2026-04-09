"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-green-700 text-white p-5">
      <h1 className="text-xl font-bold mb-6">LET'S SAVE!</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/reports">Reports</Link>
        <Link href="/account">Accounts</Link>
      </nav>
    </div>
  );
}