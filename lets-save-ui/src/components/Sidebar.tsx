"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-green-800 text-white p-6 flex flex-col gap-6">
      <h1 className="text-xl font-bold">LET’S SAVE!</h1>

      <nav className="flex flex-col gap-3">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/reports">Reports</Link>
        <Link href="/account">Accounts</Link>
      </nav>
    </div>
  );
}