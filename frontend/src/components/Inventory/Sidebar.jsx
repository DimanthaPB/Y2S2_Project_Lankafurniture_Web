import React from "react";
import "./Inventory.css"; // reuse same styles

function Navbar() {
  return (
    <header className="navbar">
      {/* Logo 
      <div className="navbar-logo">
        <img src="/logo.jpg" alt="Logo" width={120} height={100} />
      </div>
      */}

      {/* Navigation Links */}
      <nav className="navbar-links">
        <a href="/invDashboard">Dashboard</a>
        <a href="/inventory">Inventory</a>
        <a href="/report">Reports</a>
        <a href="/suppliers">Suppliers</a>
        <a href="/settings">Settings</a>
      </nav>
    </header>
  );
}

export default Navbar;
