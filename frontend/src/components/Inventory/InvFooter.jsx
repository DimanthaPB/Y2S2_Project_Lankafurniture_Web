import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Inventory Management System</p>
      <p className="footer-links">
        <a href="/dashboard">Dashboard</a> | 
        <a href="/inventory">Inventory</a> | 
        <a href="/report">Reports</a>
      </p>
    </footer>
  );
}

export default Footer;
