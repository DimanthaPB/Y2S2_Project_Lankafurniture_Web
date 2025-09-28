import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import DashboardLayout from '../../components/Finance/DashboardLayout';
import { getAllOrders} from '../../api/orderApi';

const DashboardPage = () => {
  const { token } = useContext(AuthContext);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [pendingOrderCount, setPendingOrderCount] = useState(0); // ✅ NEW

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/projects/provider/provider123", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjectCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();

    const fetchLowStock = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/items/low-stock", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLowStockCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLowStock();

    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployeeCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserCount(res.data.count);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();

    const fetchPendingOrders = async () => {
      try {
        const data = await getAllOrders(); // no statusFilter needed
        const pending = Array.isArray(data) ? data.filter(order => order.status === 'pending') : [];
        setPendingOrderCount(pending.length);
      } catch (err) {
        console.error("Error fetching pending orders:", err);
      }
    };
    fetchPendingOrders();
  }, [token]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Main Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Employee Count */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Total Employees</h2>
          <p className="text-4xl font-bold text-blue-600 mt-4">{employeeCount}</p>
        </div>

        {/* User Count */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Total Users</h2>
          <p className="text-4xl font-bold text-purple-600 mt-4">{userCount}</p>
        </div>

        {/* Low Stock Count */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Low Stock Items</h2>
          <p className="text-4xl font-bold text-red-500 mt-4">{lowStockCount}</p>
        </div>

        {/* Project Count */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Active Projects</h2>
          <p className="text-4xl font-bold text-orange-500 mt-4">{projectCount}</p>
        </div>

        {/* ✅ Pending Orders */}
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-600">Pending Orders</h2>
          <p className="text-4xl font-bold text-yellow-500 mt-4">{pendingOrderCount}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;