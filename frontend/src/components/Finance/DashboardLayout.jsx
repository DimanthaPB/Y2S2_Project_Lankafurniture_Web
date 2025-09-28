import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ArchiveBoxIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import logo from "../../assets/logo.jpg";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex bg-amber-30 min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-full bg-amber-800 text-white flex flex-col shadow-lg z-20">
        {/* Logo + Title */}
        <div className="flex items-center justify-center p-4 border-b border-amber-700 space-x-3">
          <img src={logo} alt="Logo" className="h-12 w-16 object-contain rounded" />
          <span className="text-xl font-semibold">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/adminDashboard"
            className="flex items-center px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Dashboard
          </Link>
          <Link
            to="/employees"
            className="flex items-center px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            <UsersIcon className="h-5 w-5 mr-2" />
            Employees
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            <UsersIcon className="h-5 w-5 mr-2" />
            Users
          </Link>
          <Link
            to="/invDashboard"
            className="flex items-center px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            <ArchiveBoxIcon className="h-5 w-5 mr-2" />
            Inventory
          </Link>
          <Link
            to="/serviceproviderdashboard/provider123"
            className="flex items-center px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            <ArchiveBoxIcon className="h-5 w-5 mr-2" />
            ServiceProvider
          </Link>
          <Link
            to="/order-dashboard"
            className="flex items-center px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            <ArchiveBoxIcon className="h-5 w-5 mr-2" />
            Order Dashboard
          </Link>
          <Link
            to="/deliDashboard"
            className="flex items-center px-4 py-2 rounded hover:bg-amber-700 transition"
          >
            <ArchiveBoxIcon className="h-5 w-5 mr-2" />
            Delivery Dashboard
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-amber-700">
          <button
            className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Top Bar */}
      <header className="fixed top-0 left-64 right-0 h-16 bg-white shadow flex items-center px-6 z-10">
        <h2 className="text-lg font-medium text-amber-900">Welcome, Admin</h2>
      </header>

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6 bg-amber-50 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;