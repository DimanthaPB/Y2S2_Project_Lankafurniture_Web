import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./CreateProject.css";
import axios from "axios";

const CATEGORIES = ["General", "Carpentry", "Upholstery", "Other"];
const STATUSES = ["Pending", "Ongoing", "Completed"];

function EditProject() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const providerId = "provider123";
  const API_BASE = "http://localhost:5001/api";
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    status: "Pending",
    startDate: "",
    endDate: "",
    createdAt: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setServerError("");

        const toYMD = (val) => {
          if (!val) return "";
          try {
            if (typeof val === "string" && val.length >= 10) return val.slice(0, 10);
            const d = new Date(val);
            if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
          } catch (_) {}
          return "";
        };

        const res = await axios.get(`${API_BASE}/projects/id/${projectId}`);
        const project = res.data.project || res.data;
        if (!project) throw new Error("Project not found");

        setForm({
          title: project.title || "",
          description: project.description || "",
          category: project.category || "General",
          status: project.status || "Pending",
          startDate: toYMD(project.startDate),
          endDate: toYMD(project.endDate),
          createdAt: toYMD(project.createdAt),
        });
      } catch (err) {
        console.error("Load project error:", err);
        setServerError(err?.response?.data?.error || err.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId]);

  const errors = useMemo(() => {
    const e = {};
    const title = form.title.trim();
    const description = form.description.trim();

    if (!providerId) e.providerId = "Missing provider id in URL.";
    if (!title) e.title = "Title is required.";
    else if (title.length < 3) e.title = "Title must be at least 3 characters.";
    else if (title.length > 100) e.title = "Title must be under 100 characters.";

    if (!description) e.description = "Description is required.";
    else if (description.length > 1000) e.description = "Description must be under 1000 characters.";

    if (!CATEGORIES.includes(form.category)) e.category = "Select a valid category.";
    if (!STATUSES.includes(form.status)) e.status = "Select a valid status.";

    if (form.startDate) {
      const sd = new Date(form.startDate);
      if (isNaN(sd.getTime())) e.startDate = "Invalid start date.";
      const startStr = form.startDate;
      const createdStr = form.createdAt || todayStr;
      if (createdStr && startStr < createdStr) {
        e.startDate = "Start date cannot be before project created date.";
      }
    } else {
      e.startDate = "Start date is required.";
    }

    if (form.endDate) {
      const ed = new Date(form.endDate);
      if (isNaN(ed.getTime())) e.endDate = "Invalid end date.";
      if (form.startDate) {
        const sd = new Date(form.startDate);
        if (!isNaN(sd.getTime()) && ed < sd) e.endDate = "End date must be after start date.";
      }
    }

    return e;
  }, [form, providerId, todayStr]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);
  const onChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setServerSuccess("");
    if (!isValid) return;

    try {
      setSubmitting(true);
      await axios.put(`${API_BASE}/projects/${projectId}`, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
      });
      setServerSuccess("Project updated successfully.");
      setTimeout(() => navigate(`/provider/${providerId}/projects`), 600);
    } catch (err) {
      console.error("Update project error:", err);
      setServerError(err?.response?.data?.error || "Failed to update project.");
    } finally {
      setSubmitting(false);
    }
  };

  const titleCharCount = form.title.length;
  const descCharCount = form.description.length;

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
          <div className="project-form-container">
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div className="btn-primary loading" style={{ width: "40px", height: "40px" }}></div>
              <p style={{ color: "var(--muted)", fontSize: "16px" }}>Loading project details...</p>
            </div>
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
        
        <div className="form-header">
          <h1>Edit Project</h1>
          <p>Update the project details below to modify your existing project.</p>
        </div>

        <div className="project-form-container">
          {/* Alert Messages */}
          {serverError && (
            <div className="alert alert-error">
              {serverError}
            </div>
          )}
          {serverSuccess && (
            <div className="alert alert-success">
              {serverSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="project-form" noValidate>
            {/* Basic Information Section */}
            <div className="form-section">
              <h3 className="form-section-title">📋 Basic Information</h3>
              
              <div className="form-group">
                <label className="required">Project Title</label>
                <div className="input-with-icon">
                  <span className="input-icon">📝</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={onChange("title")}
                    placeholder="e.g., Custom Oak Dining Table"
                    className={errors.title ? 'error' : ''}
                    required
                  />
                </div>
                <div className={`character-counter ${titleCharCount > 90 ? 'warning' : ''} ${titleCharCount > 100 ? 'error' : ''}`}>
                  {titleCharCount}/100 characters
                </div>
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label className="required">Project Description</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={onChange("description")}
                  placeholder="Describe the project scope, dimensions, materials, timelines, and any special requirements..."
                  className={errors.description ? 'error' : ''}
                  required
                />
                <div className={`character-counter ${descCharCount > 900 ? 'warning' : ''} ${descCharCount > 1000 ? 'error' : ''}`}>
                  {descCharCount}/1000 characters
                </div>
                {errors.description && <span className="error-message">{errors.description}</span>}
                <div className="help-text">
                  Provide detailed information to help clients understand the project requirements.
                </div>
              </div>
            </div>

            {/* Project Details Section */}
            <div className="form-section">
              <h3 className="form-section-title">🔧 Project Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="required">Category</label>
                  <select 
                    value={form.category} 
                    onChange={onChange("category")}
                    className={errors.category ? 'error' : ''}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label className="required">Project Status</label>
                  <select 
                    value={form.status} 
                    onChange={onChange("status")}
                    className={errors.status ? 'error' : ''}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.status && <span className="error-message">{errors.status}</span>}
                  <div className="help-text">
                    {form.status === 'Pending' ? 'Project is planned but not yet started' : 'Project is currently in progress'}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="form-section">
              <h3 className="form-section-title">📅 Timeline</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="required">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    min={form.createdAt || undefined}
                    onChange={onChange("startDate")}
                    className={errors.startDate ? 'error' : ''}
                  />
                  {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                  <div className="help-text">Start date can be moved forward but not before the project creation date.</div>
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={form.endDate} 
                    min={form.startDate || form.createdAt || undefined}
                    onChange={onChange("endDate")}
                    className={errors.endDate ? 'error' : ''}
                  />
                  {errors.endDate && <span className="error-message">{errors.endDate}</span>}
                  <div className="help-text">Leave empty if timeline is flexible</div>
                </div>
              </div>
            </div>

            {/* Provider ID Notice */}
            {errors.providerId && (
              <div className="provider-notice">
                {errors.providerId}
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                className={`btn-primary ${submitting ? 'loading' : ''}`}
                type="submit" 
                disabled={submitting || !isValid}
              >
                {submitting ? "Saving Changes..." : "💾 Save Changes"}
              </button>
              
              <Link 
                to={`/provider/${providerId}/projects`} 
                className="btn-secondary"
              >
                ❌ Cancel
              </Link>
            </div>

            {/* Project Info Notice */}
            <div className="provider-notice" style={{ background: '#e0f2fe', borderColor: '#81d4fa', color: '#01579b' }}>
              💡 You're editing project ID: {projectId}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProject;