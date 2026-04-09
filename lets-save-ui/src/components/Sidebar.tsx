"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-green-800 text-white p-6">
      <h1 className="text-xl font-bold mb-8">LET’S SAVE!</h1>

      <div className="space-y-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/reports">Reports</Link>
        <Link href="/account">Accounts</Link>
      </div>
    </div>
  );
}