import React, { useState, useEffect } from "react";
import axios from "axios";
import './ServiceProviderDashboard.css';
import { useParams, Link } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Spin, Alert } from "antd";


function ServiceProviderDashboard() {
  const providerId = "provider123";
  const [projects, setProjects] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectsRes = await axios.get(`http://localhost:5001/api/projects/provider/${providerId}`);
      setProjects(projectsRes.data);

      const transactionsRes = await axios.get(`http://localhost:5001/api/transactions/${providerId}`);
      setTransactions(transactionsRes.data);

      const ratingsRes = await axios.get(`http://localhost:5001/api/ratings/provider/${providerId}`);
      setRatings(ratingsRes.data);

    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again later.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [providerId]);

  // Project Status Pie Chart (supports Pending | Ongoing | Completed)
  const projectStatus = projects.reduce(
    (acc, proj) => {
      const status = (proj.status || '').toLowerCase();
      if (status === 'completed') acc.completed++;
      else if (status === 'pending') acc.pending++;
      else acc.ongoing++;
      return acc;
    },
    { completed: 0, ongoing: 0, pending: 0 }
  );

  const projectPie = {
    labels: ["Completed", "Ongoing", "Pending"],
    datasets: [
      {
        label: "Projects",
        data: [projectStatus.completed, projectStatus.ongoing, projectStatus.pending],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFB300"],
      },
    ],
  };

  // Income Bar Chart
  const incomeBar = {
    labels: transactions.map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: "Income (Rs.)",
        data: transactions.map((t) => t.amount),
        backgroundColor: "#FF9800",
      },
    ],
  };

  // Average Rating
  const avgRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : "No ratings yet";

  // Aggregates for quick stats
  const totalIncome = transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const totalProjects = projects.length;
  const totalRatings = ratings.length;

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Spin size="large" />
        <p style={{ marginTop: '20px' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error" style={{ padding: '20px' }}>
        <Alert 
          message="Error Loading Dashboard" 
          description={
            <div>
              <p>{error}</p>
              <p>Please check your internet connection and try again.</p>
              <button 
                onClick={() => window.location.reload()} 
                style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}
              >
                Retry
              </button>
            </div>
          } 
          type="error" 
          showIcon 
          style={{ maxWidth: '600px', margin: '0 auto' }}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <ul>
          <li>
            <Link to={`/serviceproviderdashboard/${providerId}`}>🏠 Overview</Link>
          </li>
          <li>
            <Link to={`/provider/${providerId}/projects`}>📁 Projects</Link>
          </li>
          <li>
            <Link to={`/provider/${providerId}/transactions`}>💳 Transactions</Link>
          </li>
          <li>
            <Link to={`/provider/${providerId}/ratings`}>⭐ Ratings</Link>
          </li>
          <li>
            <Link to={`/newArrivals`}>📦 New Arrivals</Link>
          </li>
          <li><Link to={`/adminDashboard`}>📁 Admin Dashboard</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="dashboard-content">
        <h1>Service Provider Dashboard</h1>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Projects</div>
            <div className="stat-value">{totalProjects}</div>
            <div className="stat-label">Completed: {projectStatus.completed} • Ongoing: {projectStatus.ongoing} • Pending: {projectStatus.pending}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Income (Rs.)</div>
            <div className="stat-value">{totalIncome.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Rating</div>
            <div className="stat-value">{typeof avgRating === 'string' ? avgRating : `${avgRating} ⭐`}</div>
            <div className="stat-label">Ratings: {totalRatings}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Provider</div>
            <div className="stat-value" title={providerId}>{providerId || 'N/A'}</div>
          </div>
        </div>

        {!providerId && (
          <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
            <strong>Provider not selected.</strong> Use a URL like
            {" "}
            <code style={{ background:'#f6efe6', padding:'2px 6px', borderRadius:4 }}>
              /serviceproviderdashboard/provider123
            </code>
            {" "}
            to view your data.
          </div>
        )}

        <div className="dashboard-grid">
          {/* Top Row */}
          <div className="card my-projects">
            <h2>My Projects</h2>
            {projects.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No projects found.</p>
            ) : (
              <ul style={{ display:'grid', gap:10, padding:0, listStyle:'none' }}>
                {projects.map((proj) => {
                  const status = (proj.status || '').toLowerCase();
                  const badgeClass = status === 'completed' ? 'badge-completed' : status === 'pending' ? 'badge-pending' : 'badge-ongoing';
                  return (
                    <li key={proj._id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontWeight:600 }}>{proj.title}</span>
                      <span className={badgeClass}>{proj.status}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="card project-status">
            <h2>Project Status</h2>
            <Pie data={projectPie} />
          </div>

          <div className="card customer-ratings">
            <h2>Customer Ratings</h2>
            <p className="rating-value">⭐ Average Rating: {avgRating}</p>
            {ratings.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>No ratings yet.</p>
            ) : (
              <ul style={{ display:'grid', gap:10, padding:0, listStyle:'none' }}>
                {ratings.map((r) => (
                  <li key={r._id} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className="rating-star">⭐ {r.rating}</span>
                    <span style={{ fontWeight:600 }}>{r.customerName || 'Customer'}</span>
                    <span className="italic" style={{ color:'var(--muted)' }}>{r.comment}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom Row */}
          <div className="card transactions-card">
            <h2>Transactions</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount (Rs.)</th>
                    <th>Status</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ color:'var(--muted)' }}>No transactions.</td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr key={t._id}>
                        <td>{t.date ? new Date(t.date).toLocaleDateString() : '-'}</td>
                        <td style={{ textTransform:'capitalize' }}>{t.type}</td>
                        <td>{(parseFloat(t.amount)||0).toLocaleString()}</td>
                        <td>{t.status || '-'}</td>
                        <td>{t.reference || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card income-card">
            <h2>Income</h2>
            <Bar data={incomeBar} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceProviderDashboard;
