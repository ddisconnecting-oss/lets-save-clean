export default function Account() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Account Settings</h1>

      <input placeholder="Name" className="input mt-4" />
      <input placeholder="Email" className="input mt-2" />

      <button className="btn mt-4">Save changes</button>
    </div>
  );
}