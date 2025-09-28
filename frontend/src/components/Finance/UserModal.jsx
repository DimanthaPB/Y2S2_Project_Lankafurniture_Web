import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'client',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'client',
        password: '', // leave blank on edit
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'client',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-amber-50 rounded-lg shadow-xl w-full max-w-lg p-6 border border-amber-200">
        <h2 className="text-2xl font-semibold text-amber-900 mb-4">
          {user ? 'Edit User' : 'Add User'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            pattern="[A-Za-z\s]+"
            title="Only letters and spaces allowed"
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          {!user && (
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          )}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="client">Client</option>
            <option value="craftsman">Craftsman</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;