import { useEffect, useState } from "react";
import feedbackService from "../../../services/feedbackService";
import FeedbackCard from "../../../components/Delivery/client/FeedbackCard";

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await feedbackService.getAll();
        setFeedback(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load feedback data");
        setFeedback([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const filteredFeedback = feedback.filter((review) => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });

  const averageRating =
    feedback.length > 0
      ? (
          feedback.reduce((sum, review) => sum + review.rating, 0) /
          feedback.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Feedback Management
          </h1>
          <p className="text-gray-600">Monitor and manage customer feedback</p>
        </div>
        <div className="flex space-x-3">
          <select
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 text-red-800 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Feedback Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Reviews
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {feedback.length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Average Rating
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {averageRating}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">This Week</h3>
              <p className="text-2xl font-bold text-gray-900">
                {
                  feedback.filter((f) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(f.createdAt) > weekAgo;
                  }).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                5 Star Reviews
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {feedback.filter((f) => f.rating === 5).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white border border-gray-100 shadow-lg rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Customer Feedback
            </h3>
            <span className="text-sm text-gray-600">
              {filteredFeedback.length}{" "}
              {filter !== "all" ? `${filter}-star` : ""} review
              {filteredFeedback.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading feedback...</p>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {filter === "all"
                ? "No feedback yet"
                : `No ${filter}-star reviews`}
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "Customer feedback will appear here once submitted."
                : `Try selecting a different rating filter.`}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {filteredFeedback.map((review) => (
              <FeedbackCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
