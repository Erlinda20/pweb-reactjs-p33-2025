import { removeToken, getToken } from "../utils/storage";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../api/auth";
import type { MeResponse } from "../api/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<MeResponse | null>(null);

  useEffect(() => {
    if (getToken()) {
      getUser()
        .then((data: MeResponse) => setUser(data))
        .catch(() => setUser(null));
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center bg-white border-b px-6 py-3 shadow-sm">
      <div className="flex items-center gap-6">
        <Link to="/books" className="text-gray-800 font-semibold hover:underline">
          IT Lecture 📚
        </Link>
        <Link to="/books" className="text-gray-600 hover:text-gray-900 text-sm">
          Buku
        </Link>
        <Link to="/transactions" className="text-gray-600 hover:text-gray-900 text-sm">
          Transaksi
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user?.email && <span className="text-gray-700 text-sm">{user.email}</span>}
        <button
          onClick={handleLogout}
          className="bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
