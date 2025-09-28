import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5001/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header />
      {/* Spacer below header */}
      <div className="pt-24 pb-6 bg-amber-50 min-h-screen">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-amber-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-amber-900">Log In</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-amber-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-amber-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 rounded transition"
            >
              Log In
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-amber-800">
            No account? <Link to="/signup" className="underline hover:text-amber-600">Register</Link>
          </p>
          <p className="mt-2 text-sm text-center text-amber-800">
            Admin Login – <Link to="/adminLogin" className="underline hover:text-amber-600">Here</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}