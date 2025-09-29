import { useState } from "react";
import Button from "../shared/Button";

export default function TeamTable({ teams, members, onUpdate, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    memberIds: [],
  });

  const startEdit = (t) => {
    setEditId(t._id);
    setForm({
      name: t.name,
      description: t.description || "",
      memberIds: t.members.map((m) => m._id),
    });
  };

  const save = async () => {
    await onUpdate(editId, form);
    setEditId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-800">Delivery Teams</h3>
      </div>

      {teams.length === 0 ? (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-500">Create your first delivery team to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {teams.map((t) => (
            <div key={t._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editId === t._id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Team Name
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team Members
                        </label>
                        <div className="max-h-32 overflow-auto border border-gray-300 rounded-lg p-3 space-y-2">
                          {members.map((m) => (
                            <label key={m._id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={form.memberIds.includes(m._id)}
                                onChange={(e) => {
                                  const set = new Set(form.memberIds);
                                  e.target.checked ? set.add(m._id) : set.delete(m._id);
                                  setForm({ ...form, memberIds: Array.from(set) });
                                }}
                              />
                              <span className="text-sm">
                                {m.name} - {m.role}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{t.name}</h4>
                          {t.description && (
                            <p className="text-sm text-gray-600">{t.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-2">
                          Team Members ({t.members.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {t.members.map((m) => (
                            <span
                              key={m._id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-6 flex space-x-2">
                  {editId === t._id ? (
                    <>
                      <button
                        onClick={save}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(t)}
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
                        onClick={() => onDelete(t._id)}
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
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
