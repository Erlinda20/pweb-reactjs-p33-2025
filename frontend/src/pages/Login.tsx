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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[22rem]">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            IT Literature <span>📚</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Akses katalog buku favoritmu dengan mudah
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
