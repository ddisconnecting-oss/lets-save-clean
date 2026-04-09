export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-[320px]">
        <h2 className="text-xl font-bold mb-4">Welcome back!</h2>

        <input placeholder="Email" className="input" />
        <input placeholder="Password" type="password" className="input mt-2" />

        <button className="btn mt-4 w-full">Login</button>

        <p className="text-sm mt-2 text-center">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}