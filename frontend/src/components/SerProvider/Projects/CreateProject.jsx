import React, { useMemo, useState } from "react";
import "./CreateProject.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const CATEGORIES = ["General", "Carpentry", "Upholstery", "Other"];
const STATUSES = ["Pending", "Ongoing"];

function CreateProject() {
  const navigate = useNavigate();
  const providerId = "provider123";
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    status: "Pending",
    startDate: "", // will be set to today on first render below
    endDate: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  // Ensure startDate defaults to today (and remains within allowed range)
  useMemo(() => {
    if (!form.startDate) {
      setForm((prev) => ({ ...prev, startDate: todayStr }));
    }
  }, [form.startDate, todayStr]);

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

    // Date validations (Create): start must be today or future
    if (form.startDate) {
      const sd = new Date(form.startDate);
      if (isNaN(sd.getTime())) e.startDate = "Invalid start date.";
      const startStr = form.startDate;
      if (startStr < todayStr) e.startDate = "Start date cannot be before today.";
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
      // End date must be on/after start date
      const minEnd = form.startDate || todayStr;
      if (form.endDate < minEnd) {
        e.endDate = "End date cannot be before start date.";
      }
    }

    return e;
  }, [form, providerId, todayStr]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const onChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // If start date goes to the future, force status to Pending
      if (key === 'startDate') {
        if (value > todayStr) {
          next.status = 'Pending';
        }
      }
      // If status toggles to Pending, ensure startDate is not past
      if (key === 'status' && value === 'Pending') {
        if (!next.startDate || next.startDate < todayStr) next.startDate = todayStr;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setServerSuccess("");

    if (!isValid) return;

    try {
      setSubmitting(true);
      await axios.post("http://localhost:5001/api/projects", {
        providerId,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
        ...(form.startDate ? { startDate: form.startDate } : {}),
        ...(form.endDate ? { endDate: form.endDate } : {}),
      });
      setServerSuccess("Project created successfully.");
      setForm({ title: "", description: "", category: "General", status: "Pending", startDate: todayStr, endDate: "" });
      setTimeout(() => navigate(`/provider/${providerId}/projects`), 600);
    } catch (err) {
      console.error("Create project error:", err);
      setServerError(err?.response?.data?.error || "Failed to create project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const titleCharCount = form.title.length;
  const descCharCount = form.description.length;

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
        </ul>
      </aside>
      
      <div className="dashboard-content">
        
        <div className="form-header">
          <h1>Create New Project</h1>
          <p>Fill in the details below to create a new project for your services.</p>
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
                    disabled={form.startDate > todayStr}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.status && <span className="error-message">{errors.status}</span>}
                  <div className="help-text">
                    {form.startDate > todayStr
                      ? 'Start date is in the future; status is locked to Pending.'
                      : form.status === 'Pending' ? 'Project is planned but not yet started' : 'Project is currently in progress'}
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
                    min={todayStr}
                    onChange={onChange("startDate")}
                    className={errors.startDate ? 'error' : ''}
                  />
                  {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={form.endDate} 
                    min={form.startDate || todayStr}
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
                {submitting ? "Creating Project..." : "Create Project"}
              </button>
              
              <Link 
                to={`/provider/${providerId}/projects`} 
                className="btn-secondary"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;