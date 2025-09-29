import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import feedbackService from "../../../services/feedbackService";
import FeedbackCard from "../../../components/Delivery/client/FeedbackCard";

export default function TeamReviews() {
  const { teamId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await feedbackService.getFeedbackByTeam(teamId);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load reviews. Please try again.");
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchReviews();
    }
  }, [teamId]);

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating),
      0
    );
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filter by rating
    if (filterRating !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === Number(filterRating)
      );
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "oldest":
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const StarRating = ({ rating, size = "w-5 h-5" }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${size} ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  const UserAvatar = ({ name }) => {
    const initials =
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];

    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

    return (
      <div
        className={`w-10 h-10 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold text-sm`}
      >
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredReviews = getFilteredAndSortedReviews();
  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Team Reviews
            </h1>
            <p className="text-lg text-gray-600">
              Customer feedback and ratings for Team {teamId}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-8">
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Reviews Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Reviews Summary
                </h2>

                {/* Overall Rating */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-800 mb-2">
                    {averageRating}
                  </div>
                  <StarRating
                    rating={Math.round(averageRating)}
                    size="w-6 h-6"
                  />
                  <p className="text-gray-600 mt-2">
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2 mb-6">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = distribution[rating] || 0;
                    const percentage =
                      reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                    return (
                      <div key={rating} className="flex items-center text-sm">
                        <span className="w-3 text-gray-600">{rating}</span>
                        <svg
                          className="w-4 h-4 text-yellow-400 mx-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <div className="flex-1 mx-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="w-8 text-gray-600 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Filters */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rating</option>
                      <option value="lowest">Lowest Rating</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Rating
                    </label>
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {filteredReviews.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      No Reviews Found
                    </h3>
                    <p className="text-gray-600">
                      {filterRating !== "all"
                        ? `No reviews with ${filterRating} star${
                            filterRating !== "1" ? "s" : ""
                          } found.`
                        : "This team hasn't received any reviews yet."}
                    </p>
                  </div>
                ) : (
                  filteredReviews.map((review) => (
                    <FeedbackCard key={review._id} review={review} />
                  ))
                )}
              </div>

              {/* Load More Button (if needed for pagination) */}
              {filteredReviews.length > 0 && (
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Showing {filteredReviews.length} of {reviews.length} review
                    {reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}