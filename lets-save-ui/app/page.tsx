export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold mb-4">LET'S SAVE!</h1>
      <p className="mb-6 text-lg">Create your own budget tracker</p>

      <div className="flex gap-4">
        <a href="/login" className="bg-green-600 text-white px-6 py-2 rounded-xl">Login</a>
        <a href="/signup" className="border px-6 py-2 rounded-xl">Sign up</a>
      </div>
    </main>
  );
}