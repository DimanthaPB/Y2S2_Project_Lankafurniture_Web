import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5001/api/admin/login', {
        username,
        password,
      });

      login(res.data.token);
      navigate('/adminDashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-[url('./assets/wood-bg.png')] bg-cover bg-center">
      <div className="bg-white/30 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 w-96">
        <h1 className="text-3xl font-bold text-center text-amber-900 mb-6">Admin Login</h1>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-amber-800 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-amber-800 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-amber-300 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 rounded-lg transition shadow"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;