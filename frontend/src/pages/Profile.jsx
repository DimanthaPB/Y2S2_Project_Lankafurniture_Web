import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, deleteAccount } from '../api/userApi';
import Header from '../components/Header';

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile(currentUser.id ?? currentUser._id, formData);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentUser({ ...currentUser, ...formData });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteAccount(currentUser.id ?? currentUser._id);
        handleLogout();
        alert("Account deleted successfully!");
      } catch (error) {
        alert("Failed to delete account: " + error.message);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      <Header/>
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-6">
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition shadow-lg backdrop-blur-sm border border-white/30"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="p-8">
            {currentUser ? (
              <div>
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-amber-900 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-amber-900 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition bg-white/50"
                      />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition shadow-lg font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition shadow font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                      <p className="text-amber-900 mb-3">
                        <strong className="font-semibold text-amber-800">Name:</strong>
                        <span className="ml-3 text-lg">{currentUser.name}</span>
                      </p>
                      <p className="text-amber-900 mb-3">
                        <strong className="font-semibold text-amber-800">Email:</strong>
                        <span className="ml-3 text-lg">{currentUser.email}</span>
                      </p>
                      <p className="text-amber-900">
                        <strong className="font-semibold text-amber-800">Role:</strong>
                        <span className="ml-3 text-lg capitalize">{currentUser.role}</span>
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition shadow-lg font-medium"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition shadow-lg font-medium"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-amber-600 text-center py-8">No user information available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;