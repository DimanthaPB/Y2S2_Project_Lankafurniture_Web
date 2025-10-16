import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Spin, Alert } from "antd";
import "./newArrivals.css";

function NewArrivals() {
  const providerId = "provider123";
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 search state

  useEffect(() => {
    const fetchNewJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/jobs/new");
        setJobs(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch new jobs.");
        console.error("Error fetching new jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewJobs();
  }, [providerId]);

  // Filter jobs by search term (case-insensitive)
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="new-arrivals-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
        <ul>
          <li><Link to={`/serviceproviderdashboard/${providerId}`}>🏠 Dashboard</Link></li>
          <li><Link to={`/provider/${providerId}/projects`}>📁 Projects</Link></li>
          <li><Link to={`/provider/${providerId}/transactions`}>💳 Transactions</Link></li>
          <li><Link to={`/provider/${providerId}/ratings`}>⭐ Ratings</Link></li>
          <li><Link to={`/newArrivals`}>📦 New Arrivals</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="new-arrivals-content">
        <h2>📦 New Jobs</h2>

        {/* 🔍 Search Box */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search jobs by title, description, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-box"
          />
        </div>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>Loading new jobs...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <Alert message="Error" description={error} type="error" showIcon />
            <button onClick={() => window.location.reload()} style={{ marginTop: "20px" }}>
              Retry
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <p>No jobs found matching your search.</p>
          </div>
        ) : (
          <div className="job-list">
            {filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Description:</strong> {job.description.substring(0, 100)}...</p>
                <p><strong>Customer:</strong> {job.customerName} ({job.customerEmail})</p>
                <p><strong>Location:</strong> {job.customerLocation}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default NewArrivals;