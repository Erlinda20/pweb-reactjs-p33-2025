import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/storage';
import { useEffect, useState } from 'react';
import { getMe } from '../api/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    getMe()
      .then((data) => setUserEmail(data.email))
      .catch(() => setUserEmail(''));
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between bg-gray-800 text-white p-3">
      <div className="flex gap-4">
        <button onClick={() => navigate('/books')}>Books</button>
        <button onClick={() => navigate('/transactions')}>Transactions</button>
      </div>
      <div className="flex gap-3 items-center">
        <span>{userEmail}</span>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}
