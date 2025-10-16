import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Spin,
  Alert,
  Form,
  Input,
  Button,
  message,
  Modal,
} from "antd";
import { InputNumber } from "antd";
import Header from "../Header";
import Footer from "../Footer";
import "./JobAdd.css";

function NewArrivalsDashboard() {
  const providerId = "provider123";
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Rating modal states
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingForm] = Form.useForm();
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchNewJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/jobs/new");
      setJobs(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch new jobs.");
      console.error("Error fetching new jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewJobs();
  }, [providerId]);

    const onFinish = async (values) => {
    setCreating(true);
    try {
        const response = await axios.post("http://localhost:5001/api/test-data/jobs", {
        ...values,
        status: "new",
        });

        if (response.data?.success) {
        form.resetFields();
        setIsModalOpen(false);
        fetchNewJobs();
        // Show success message after modal closes
        setTimeout(() => {
            message.success("Job added successfully!");
        }, 300);
        } else {
        throw new Error(response.data?.message || "Failed to add job");
        }
    } catch (error) {
        console.error("Error adding job:", error);
        message.error(error.response?.data?.message || "Failed to add job");
    } finally {
        setCreating(false);
    }
    };

    const handleRatingSubmit = async (values) => {
    setRatingLoading(true);
    try {
        const response = await axios.post("http://localhost:5001/api/test-data/ratings", {
        ...values,
        rating: parseFloat(values.rating) || 5,
        comment: values.comment || "Test rating",
        });

        if (response.data?.success) {
        ratingForm.resetFields();
        setRatingModalOpen(false);
        // Show success message after modal closes
        setTimeout(() => {
            message.success("Rating added successfully!");
        }, 300);
        } else {
        throw new Error(response.data?.message || "Failed to add rating");
        }
    } catch (error) {
        console.error("Error adding rating:", error);
        message.error(error.response?.data?.message || "Failed to add rating");
    } finally {
        setRatingLoading(false);
    }
    };

  return (
    <div className="new-arrivals">
      <Header />
    <div className="dashboard-header">
      <br />
      <div className="button-group">
        <Button
          className="themed-button primary"
          onClick={() => setIsModalOpen(true)}
        >
          Request Custom Job
        </Button>
        <Button
          className="themed-button secondary"
          onClick={() => setRatingModalOpen(true)}
        >
          Add Rating
        </Button>
      </div>
    </div>

      {/* Job Modal */}
      <Modal
        title="Add New Job"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ providerId }}
        >
          <Form.Item name="providerId" label="Provider ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Job Description" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="customerEmail" label="Customer Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="customerLocation" label="Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={creating}>
              {creating ? "Creating..." : "Add Job"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Rating Modal */}
      <Modal
        title="Add Rating"
        open={ratingModalOpen}
        onCancel={() => setRatingModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={ratingForm}
          layout="vertical"
          onFinish={handleRatingSubmit}
          initialValues={{ rating: 5 }}
        >
          <Form.Item name="providerId" label="Provider ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="rating" label="Rating (1–5)" rules={[{ required: true, type: "number", min: 1, max: 5 }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="customerId" label="Customer ID (optional)">
            <Input />
          </Form.Item>
          <Form.Item name="comment" label="Comment">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={ratingLoading}>
              {ratingLoading ? "Submitting..." : "Add Rating"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Job List */}
      <div className="job-list-container">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>Loading new jobs...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <Alert message="Error" description={error} type="error" showIcon />
            <button onClick={fetchNewJobs} style={{ marginTop: "20px" }}>
              Retry
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No new jobs found.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Description:</strong> {job.description.substring(0, 100)}...</p>
              <p><strong>Customer:</strong> {job.customerName} ({job.customerEmail})</p>
              <p><strong>Location:</strong> {job.customerLocation}</p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default NewArrivalsDashboard;