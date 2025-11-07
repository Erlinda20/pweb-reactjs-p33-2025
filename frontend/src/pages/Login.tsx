import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { setToken } from "../utils/storage";
import Alert, { showAlert } from "../components/Alerts";


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
        <p className="text-center text-xs text-gray-400 mt-6">
          Test alert component
        </p>
        <button onClick={() => showAlert("This is a success alert!", "success", 10000)} className="bg-green-500 text-white font-medium py-1 px-2 rounded-md hover:bg-green-600 transition mr-2">
          Show Success Alert
        </button>
        <button onClick={() => showAlert("This is an error alert!", "error", 10000)} className="bg-red-500 text-white font-medium py-1 px-2 rounded-md hover:bg-red-600 transition">
          Show Error Alert
        </button>
        <button onClick={() => showAlert("This is an info alert with description!", "info", 10000, {description: "Additional details about the info alert."})} className="bg-blue-500 text-white font-medium py-1 px-2 rounded-md hover:bg-blue-600 transition mt-2">
          Show Info Alert with Description
        </button>
        <button onClick={() => showAlert(
            "Delete Failed",
            "error",
            8000,
            {
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.",
                actions: [
                    {
                        label: "Retry",
                        variant: "primary",
                        onClick: () => console.log("Retry")
                    },
                    {
                        label: "Dismiss",
                        variant: "secondary",
                        onClick: () => console.log("Dismissed")
                    }
                ]
            })} className="bg-yellow-500 text-white font-medium py-1 px-2 rounded-md hover:bg-yellow-600 transition mt-2">
          Show Warning Alert
        </button>
      </div>
    </div>
  );
}
