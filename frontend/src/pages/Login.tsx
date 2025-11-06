import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { setToken } from "../utils/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setToken(data.token);
      navigate("/books");
    } catch {
      setError("Login gagal. Periksa email atau password.");
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[22rem]">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          IT Literature 
        </h1>

        <h2 className="text-xl font-medium text-center text-gray-700 mb-4">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-800 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-800 focus:outline-none"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="bg-gray-900 text-white font-medium py-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-gray-800 font-medium hover:underline"
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
