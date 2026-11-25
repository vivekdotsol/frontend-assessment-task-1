import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-4 bg-gray-900 p-4 text-white">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>

        {user && <Link to="/dashboard">Dashboard</Link>}
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <span>{user.username}</span>

          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-3 py-1"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
