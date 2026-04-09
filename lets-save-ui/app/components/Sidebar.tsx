export default function Sidebar() {
  return (
    <div className="w-[200px] h-screen bg-green-700 text-white p-4">
      <h2 className="font-bold mb-6">LET'S SAVE!</h2>

      <nav className="flex flex-col gap-3">
        <a href="/">Dashboard</a>
        <a href="/reports">Reports</a>
        <a href="/account">Accounts</a>
      </nav>
    </div>
  );
}