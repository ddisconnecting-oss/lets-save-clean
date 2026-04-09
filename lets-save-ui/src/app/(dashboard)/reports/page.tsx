"use client";
import Sidebar from "@/components/Sidebar";


export default function Reports({ expenses = [] }: any) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1>Reports</h1>

        <table className="w-full card">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Category</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((e: any, i: number) => (
              <tr key={i}>
                <td>{e.name}</td>
                <td>₱{e.amount}</td>
                <td>{e.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}