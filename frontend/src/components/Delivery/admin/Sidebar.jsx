import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded ${
    isActive ? "bg-white text-gray-900" : "text-white/90 hover:bg-white/10"
  }`;

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
      <h2 className="font-bold text-lg">Admin</h2>
      <nav className="flex flex-col gap-1">
        <NavLink to="/deliDashboard" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/teams" className={linkClass}>
          Teams
        </NavLink>
        <NavLink to="/members" className={linkClass}>
          Members
        </NavLink>
        <NavLink to="/tracking" className={linkClass}>
          Tracking
        </NavLink>
        <NavLink to="/feedback" className={linkClass}>
          Feedback
        </NavLink>
      </nav>
    </aside>
  );
}
