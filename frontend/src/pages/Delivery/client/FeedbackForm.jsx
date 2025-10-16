import { useState, useEffect } from "react";
import feedbackService from "../../../services/feedbackService";
import deliveryTeamService from "../../../services/deliveryTeamService";
import FeedbackCard from "../../../components/Delivery/client/FeedbackCard";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function FeedbackForm() {
  const [form, setForm] = useState({
    teamId: "",
    customerName: "",
    rating: 5,
    comment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);
        const teamsData = await deliveryTeamService.getAll();
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setMessage({
          type: "error",
          text: "Failed to load teams. Please refresh the page.",
        });
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  // Fetch recent feedback when component mounts
  useEffect(() => {
    const fetchRecentFeedback = async () => {
      try {
        setLoadingFeedback(true);
        // You might need to create a method to get recent feedback
        // const feedback = await feedbackService.getRecentFeedback();
        // setRecentFeedback(Array.isArray(feedback) ? feedback.slice(0, 3) : []);
      } catch (error) {
        console.error("Error fetching recent feedback:", error);
      } finally {
        setLoadingFeedback(false);
      }
    };

    // fetchRecentFeedback();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.teamId.trim()) newErrors.teamId = "Please select a delivery team";
    if (!form.customerName.trim()) newErrors.customerName = "Name is required";
    if (!form.comment.trim()) newErrors.comment = "Comment is required";
    if (form.rating < 1 || form.rating > 5)
      newErrors.rating = "Rating must be between 1 and 5";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await feedbackService.createFeedback(form);
      setMessage({
        type: "success",
        text: "Thank you for your feedback! We appreciate your input.",
      });
      setForm({ teamId: "", customerName: "", rating: 5, comment: "" });
      setErrors({});
    } catch (e) {
      setMessage({
        type: "error",
        text: "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`w-8 h-8 rounded-full transition-all duration-200 ${star <= rating
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-gray-300 hover:text-yellow-300"
              }`}
          >
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({rating} star{rating !== 1 ? "s" : ""})
        </span>
      </div>
    );
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feedback Form */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Share Your Experience
                </h1>
                <p className="text-lg text-gray-600">
                  Your feedback helps us improve our delivery service and serve you
                  better.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
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
                    Feedback Form
                  </h2>
                </div>

                <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                  {/* Success/Error Message */}
                  {message.text && (
                    <div
                      className={`p-4 rounded-lg border ${message.type === "success"
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-red-50 border-red-200 text-red-800"
                        } animate-fade-in`}
                    >
                      <div className="flex items-center">
                        {message.type === "success" ? (
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
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
                        )}
                        {message.text}
                      </div>
                    </div>
                  )}

                  {/* Team Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Delivery Team *
                    </label>
                    {loadingTeams ? (
                      <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Loading delivery teams...
                      </div>
                    ) : (
                      <select
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.teamId
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 focus:border-blue-500"
                          }`}
                        value={form.teamId}
                        onChange={(e) => {
                          setForm({ ...form, teamId: e.target.value });
                          if (errors.teamId) setErrors({ ...errors, teamId: "" });
                        }}
                      >
                        <option value="">Choose your delivery team</option>
                        {teams.map((team) => (
                          <option
                            key={team._id || team.id}
                            value={team._id || team.id}
                          >
                            {team.name || `Team ${team._id || team.id}`}
                            {team.specialization && ` - ${team.specialization}`}
                            {team.location && ` (${team.location})`}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.teamId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {errors.teamId}
                      </p>
                    )}
                    {form.teamId && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center text-blue-800">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            Team selected:{" "}
                            {teams.find((t) => (t._id || t.id) === form.teamId)
                              ?.name || form.teamId}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.customerName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 focus:border-blue-500"
                        }`}
                      placeholder="Enter your full name"
                      value={form.customerName}
                      onChange={(e) => {
                        setForm({ ...form, customerName: e.target.value });
                        if (errors.customerName)
                          setErrors({ ...errors, customerName: "" });
                      }}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Rating *
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <StarRating
                        rating={parseInt(form.rating)}
                        onRatingChange={(rating) => {
                          setForm({ ...form, rating });
                          if (errors.rating) setErrors({ ...errors, rating: "" });
                        }}
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Click on the stars to rate your delivery experience
                      </p>
                    </div>
                    {errors.rating && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {errors.rating}
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Feedback *
                    </label>
                    <textarea
                      rows="4"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none ${errors.comment
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 focus:border-blue-500"
                        }`}
                      placeholder="Share your experience with our delivery service. What went well? What could be improved?"
                      value={form.comment}
                      onChange={(e) => {
                        setForm({ ...form, comment: e.target.value });
                        if (errors.comment) setErrors({ ...errors, comment: "" });
                      }}
                    />
                    {errors.comment && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {errors.comment}
                      </p>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      {form.comment.length}/500 characters
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-200 ${isSubmitting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting Feedback...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
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
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                          Submit Feedback
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Recent Feedback Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Recent Feedback
                </h3>

                {loadingFeedback ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentFeedback.length > 0 ? (
                  <div className="space-y-4">
                    {recentFeedback.map((feedback, index) => (
                      <div key={index} className="text-sm">
                        <FeedbackCard review={feedback} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-300 mx-auto mb-4"
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
                    <p className="text-gray-500">No recent feedback yet</p>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Help us improve by sharing your honest feedback
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Your feedback is anonymous and helps us improve our service
              quality.
              <br />
              Thank you for choosing DeliveryApp!
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
