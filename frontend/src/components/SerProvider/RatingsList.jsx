import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Spin, Alert } from "antd";

function RatingsList() {
  const providerId = "provider123";
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/ratings/provider/${providerId}`);
        setRatings(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load ratings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [providerId]);

  if (loading) return <div style={{ padding: 20 }}><Spin /></div>;
  if (error) return <div style={{ padding: 20 }}><Alert type="error" message={error} /></div>;

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <ul>
          <li><Link to={`/serviceproviderdashboard/${providerId}`}>🏠 Dashboard</Link></li>
          <li><Link to={`/provider/${providerId}/projects`}>📁 Projects</Link></li>
          <li><Link to={`/provider/${providerId}/transactions`}>💳 Transactions</Link></li>
          <li><Link to={`/provider/${providerId}/ratings`}>⭐ Ratings</Link></li>
          <li><Link to={`/newArrivals`}>📦 New Arrivals</Link></li>
          <li><Link to={`/adminDashboard`}>📁 Admin Dashboard</Link></li>
        </ul>
      </aside>
      <div className="dashboard-content">

        <h1>Ratings</h1>
        <div className="card">
          {ratings.length === 0 ? (
            <p>No ratings found for this provider.</p>
          ) : (
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map(r => (
                  <tr key={r._id}>
                    <td>{r.customerName}</td>
                    <td>{r.rating}</td>
                    <td>{r.comment}</td>
                    <td>{r.date ? new Date(r.date).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default RatingsList;