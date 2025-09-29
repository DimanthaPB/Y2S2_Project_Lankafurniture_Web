// Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import Footer from "./InvFooter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./Inventory";

import DashboardLayout from '../Finance/DashboardLayout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const API_URL = "http://localhost:5001/api/items";

  // ====== Fetch all items ======
  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ====== Fetch low stock items ======
  const fetchLowStock = async () => {
    try {
      const res = await axios.get(`${API_URL}/low-stock`);
      setLowStock(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchLowStock();
  }, []);

  // ====== Prepare Chart Data ======
  const categories = [...new Set(items.map((i) => i.category))];
  const categoryCounts = categories.map(
    (cat) => items.filter((i) => i.category === cat).length
  );

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Products per Category",
        data: categoryCounts,
        backgroundColor: "#007bff",
      },
    ],
  };

  const lowStockLabels = lowStock.map((item) => item.name);
  const lowStockValues = lowStock.map((item) => item.quantity);

  const pieData = {
    labels: lowStockLabels,
    datasets: [
      {
        label: "Low Stock Items",
        data: lowStockValues,
        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"],
      },
    ],
  };

  return (
    <DashboardLayout>
    <div className="inventory-layout">
      {/* ====== Sidebar ====== */}
    
      

      {/* ====== Main Content ====== */}
      <div className="inventory-container">
         <Sidebar/>
        <h1>📊 Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{items.length}</h3>
            <p>Total Products</p>
          </div>
          <div className="stat-card low">
            <h3>{lowStock.length}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h2>Products per Category</h2>
            <div className="chart-wrapper">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                  },
                }}
              />
            </div>
          </div>

          <div className="chart-card">
            <h2>Low Stock Items</h2>
            <div className="chart-wrapper">
              {lowStock.length > 0 ? (
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              ) : (
                <p>No low stock items!</p>
              )}
              <Footer/>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default Dashboard;
