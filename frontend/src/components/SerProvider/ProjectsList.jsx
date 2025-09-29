import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./ProjectsList.css";

function ProjectsList() {
  const providerId = "provider123";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const API_BASE = "http://localhost:5001/api";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/projects/provider/${providerId}`);
        setProjects(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [providerId]);

  const refresh = async () => {
    try {
      const res = await axios.get(`${API_BASE}/projects/provider/${providerId}`);
      setProjects(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to refresh projects");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/projects/${id}`, { status });
      await refresh();
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.response?.data?.error || "Failed to update status");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE}/projects/${id}`);
      await refresh();
    } catch (err) {
      console.error("Delete project error:", err);
      setError(err.response?.data?.error || "Failed to delete project");
      setTimeout(() => setError(""), 3000);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pending': 'status-badge status-pending',
      'Ongoing': 'status-badge status-ongoing',
      'Completed': 'status-badge status-completed'
    };
    return statusMap[status] || 'status-badge';
  };

  if (loading) {
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
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your projects...</p>
          </div>
        </div>
      </div>
    );
  }

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
        
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">My Projects</h1>
            <p className="page-subtitle">Manage and track all your service projects</p>
          </div>
          <Link to={`/provider/${providerId}/projects/new`} className="btn-primary create-btn">
            <span className="btn-icon">➕</span>
            Create New Project
          </Link>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Projects Overview Stats */}
        <div className="projects-stats">
          <div className="stat-card">
            <div className="stat-icon pending-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{projects.filter(p => p.status === 'Pending').length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon ongoing-icon">🔄</div>
            <div className="stat-content">
              <div className="stat-value">{projects.filter(p => p.status === 'Ongoing').length}</div>
              <div className="stat-label">Ongoing</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{projects.filter(p => p.status === 'Completed').length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon total-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{projects.length}</div>
              <div className="stat-label">Total Projects</div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="projects-container">
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No Projects Yet</h3>
              <p>Start by creating your first project to showcase your services.</p>
              <Link to={`/provider/${providerId}/projects/new`} className="btn-primary">
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="projects-table-container">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Project Details</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Timeline</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id} className="project-row">
                      <td className="project-details">
                        <div className="project-title">{project.title}</div>
                        <div className="project-description">
                          {project.description?.length > 80 
                            ? `${project.description.substring(0, 80)}...` 
                            : project.description}
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{project.category}</span>
                      </td>
                      <td>
                        <select
                          value={project.status}
                          onChange={(e) => handleStatusChange(project._id, e.target.value)}
                          className="status-select"
                          disabled={project.startDate && new Date(project.startDate).toISOString().slice(0,10) > todayStr}
                          title={project.startDate && new Date(project.startDate).toISOString().slice(0,10) > todayStr ? 'Start date is in the future; status is locked to Pending' : undefined}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="timeline-info">
                        {project.startDate && (
                          <div className="date-info">
                            <small>Start: {new Date(project.startDate).toLocaleDateString()}</small>
                          </div>
                        )}
                        {project.endDate && (
                          <div className="date-info">
                            <small>End: {new Date(project.endDate).toLocaleDateString()}</small>
                          </div>
                        )}
                      </td>
                      <td className="actions-column">
                        <div className="action-buttons">
                          <Link 
                            to={`/provider/${providerId}/projects/${project._id}/edit`} 
                            className="btn-action btn-edit"
                            title="Edit Project"
                          >
                            ✏️
                          </Link>
                          <button 
                            onClick={() => handleDelete(project._id)}
                            className="btn-action btn-delete"
                            title="Delete Project"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectsList;