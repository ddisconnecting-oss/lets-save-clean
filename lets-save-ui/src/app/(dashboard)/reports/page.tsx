export default function Reports() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <table className="w-full mt-4 bg-white rounded">
        <thead>
          <tr>
            <th>Time</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
      </table>
    </div>
  );
}