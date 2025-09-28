import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import craftsmanImg from "../assets/craftsman.png";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-[url('./assets/wood-bg.png')] bg-cover bg-center h-[60vh] flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Premium Wood Products & Skilled Craft Services
        </h1>
        <p className="mt-4 text-lg max-w-2xl text-amber-100">
          Shop handcrafted wooden goods, hire expert craftsmen, or request custom jobs.
        </p>
        <div className="mt-6 space-x-4">
          <Link
            to={user ? "/shop" : "/login"}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded shadow transition"
          >
            Shop Now
          </Link>
          <Link
            to={user ? "/jobAdd" : "/login"}
            className="bg-white text-amber-900 px-6 py-3 rounded shadow hover:bg-amber-100 transition"
          >
            Hire a Craftsman
          </Link>
        </div>
      </section>

      {/* About / Services */}
      <section className="max-w-7xl mx-auto py-16 px-4 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">What We Offer</h2>
          <ul className="space-y-3 list-disc list-inside text-amber-800">
            <li>Pre-made wooden furniture & décor with doorstep delivery and tracking.</li>
            <li>Wood-based repairs (broken windows, chairs, etc.).</li>
            <li>Custom wood jobs for unique client needs.</li>
            <li>Service providers (craftsmen) can register, showcase skills, and accept projects.</li>
            <li>Inventory of wood crafting tools & equipment for purchase.</li>
          </ul>
        </div>
        <img
          src={craftsmanImg}
          alt="Craftsman at work"
          className="rounded-xl shadow-xl border border-amber-200"
        />
      </section>

      {/* CTA for Craftsmen */}
      {!user && (
        <section className="bg-amber-100 py-12 text-center">
          <h3 className="text-2xl font-bold text-amber-900 mb-4">Are you a skilled craftsman?</h3>
          <p className="mb-6 text-amber-800">
            Join our platform to find clients and grow your business.
          </p>
          <Link
            to="/signup"
            className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded shadow transition"
          >
            Register as Craftsman
          </Link>
        </section>
      )}

      <Footer />
    </>
  );
}