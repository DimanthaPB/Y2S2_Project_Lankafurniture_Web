import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/Finance/DashboardLayout';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserModal from '../../components/Finance/UserModal'; 

const AdminUsersPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
      console.error(err);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5001/api/users/${editingUser._id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('User updated successfully!');
      } else {
        await axios.post('http://localhost:5001/api/users', userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('User added successfully!');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error('Error saving user');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
      console.error(err);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users/report', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'User_Report.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to generate report');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Users List</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleAddUser}
            className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded transition"
          >
            Add User
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm p-2 border border-amber-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="overflow-x-auto bg-amber-50 shadow rounded-lg border border-amber-200">
        <table className="min-w-full text-left">
          <thead className="bg-amber-100 text-amber-900">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-amber-100">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-amber-700">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </DashboardLayout>
  );
};

export default AdminUsersPage;