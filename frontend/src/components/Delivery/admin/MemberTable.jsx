import { useState } from "react";
import Button from "../shared/Button";

export default function MemberTable({ members, teams, onUpdate, onDelete, onEdit }) {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    assignedTeam: "",
  });

  const start = (m) => {
    setEditId(m._id);
    setForm({
      name: m.name,
      role: m.role,
      phone: m.phone,
      assignedTeam: m.assignedTeam?._id || "",
    });
  };

  const save = async () => {
    await onUpdate(editId, {
      ...form,
      assignedTeam: form.assignedTeam || null,
    });
    setEditId(null);
  };

  const UserAvatar = ({ name }) => {
    const initials =
      name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "M";
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

    return (
      <div
        className={`w-10 h-10 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-800">Team Members</h3>
      </div>

      {members.length === 0 ? (
        <div className="p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No members yet
          </h3>
          <p className="text-gray-500">
            Add team members to start managing deliveries.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {members.map((m) => (
            <div
              key={m._id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              {editId === m._id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.role}
                      onChange={(e) =>
                        setForm({ ...form, role: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Team
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.assignedTeam}
                      onChange={(e) =>
                        setForm({ ...form, assignedTeam: e.target.value })
                      }
                    >
                      <option value="">— No Team —</option>
                      {teams.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      onClick={save}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <UserAvatar name={m.name} />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {m.name}
                      </h4>
                      <p className="text-sm text-gray-600">{m.role}</p>
                      <p className="text-sm text-gray-500">{m.phone}</p>
                    </div>
                    {m.assignedTeam && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {m.assignedTeam.name}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit ? onEdit(m) : start(m)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(m._id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
