import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md shadow-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src={logo}
            alt="LankaFurniture Logo"
            className="h-10 w-20 rounded border border-white/30 shadow-sm"
          />
          <span className="text-xl font-bold text-amber-900 tracking-wide">
            LankaFurniture
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6 text-amber-800 font-medium">
          <Link to="/" className="hover:text-amber-600 transition">Home</Link>
          <Link to={user ? "/shop" : "/login"} className="hover:text-amber-600 transition">Shop</Link>
          <Link to={user ? "/jobAdd" : "/login"} className="hover:text-amber-600 transition">Services</Link>
          {localStorage.getItem("user") && <Link to="/cart" className="hover:text-amber-600 transition">Cart</Link>}
          {localStorage.getItem("user") && <Link to="/my-orders" className="hover:text-amber-600 transition">My Orders</Link>}
          {localStorage.getItem("user") && <Link to="/deliHome" className="hover:text-amber-600 transition">Delivery</Link>}
          {localStorage.getItem("user") && <Link to="/track" className="hover:text-amber-600 transition">Track Order</Link>}
          {localStorage.getItem("user") && <Link to="/feedback" className="hover:text-amber-600 transition">Feedback</Link>}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="text-sm text-amber-900">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition shadow"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition shadow"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-white/70 text-amber-900 px-4 py-2 rounded hover:bg-white/90 transition shadow"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}