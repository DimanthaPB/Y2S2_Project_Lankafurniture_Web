import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "client" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header />
      <div className="pt-24 pb-6 bg-amber-50 min-h-screen">
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-amber-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-amber-900">Sign Up</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-amber-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-amber-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-amber-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-amber-300 p-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="client">Client</option>
              <option value="craftsman">Craftsman</option>
            </select>
            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 rounded transition"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-amber-800">
            Already have an account? <Link to="/login" className="underline hover:text-amber-600">Log In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}