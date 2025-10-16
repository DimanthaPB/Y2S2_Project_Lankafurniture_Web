// Report.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Report.css";
import Sidebar from "./Sidebar";

import DashboardLayout from '../Finance/DashboardLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Report() {
  const [items, setItems] = useState([]);
  const [report, setReport] = useState({ totalItems: 0, totalValue: 0 });
  const API_URL = "http://localhost:5001/api/items";

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const resItems = await axios.get(API_URL);
      const resReport = await axios.get(`${API_URL}/report`);

      setItems(resItems.data);
      setReport(resReport.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ====== Trend Chart Data (Revenue & Profit per item) ======
  const trendLabels = items.map((i) => i.name);
  const revenueData = items.map((i) => i.unitPrice * i.quantity);
  const profitData = items.map((i) => i.unitPrice * i.quantity * 0.2);

  const lineData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.3,
      },
      {
        label: "Estimated Profit",
        data: profitData,
        borderColor: "#FF9800",
        backgroundColor: "rgba(255, 152, 0, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  };

  // ====== Download PDF Report ======
  const downloadReport = () => {
    window.open(`${API_URL}/report/pdf`, "_blank");
  };

  return (
    <DashboardLayout>
    <div className="inventory-layout">

      {/* Report content */}
      
      <div className="report-container">
        <Sidebar/>
        <h1>Inventory Report</h1>
        {/* ====== Overview ====== */}
        <div className="overview">
          <div className="stat-card">
            <h3>{report.totalItems}</h3>
            <p>Total Items</p>
          </div>
          <div className="stat-card">
            <h3>Rs. {report.totalValue.toLocaleString()}</h3>
            <p>Total Value</p>
          </div>
          <div className="stat-card">
            <h3>Rs. {(report.totalValue * 0.2).toLocaleString()}</h3>
            <p>Estimated Profit</p>
          </div>
          <div className="stat-card">
            <h3>{items.filter((i) => i.quantity < i.reorderLevel).length}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>

        {/* ====== Trend Chart ====== */}
        <div className="trend-chart">
          <h2>Revenue & Profit Trend</h2>
          <div className="chart-wrapper">
            <Line data={lineData} options={options} />
          </div>
        </div>

        {/* ====== Generate PDF Report ====== */}
        <button className="download-btn" onClick={downloadReport}>
          Download Report (PDF)
        </button>
      </div>
    </div>
    </DashboardLayout>
  );
}

export default Report;
