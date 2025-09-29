import formatDate from "../../../utils/formatDate";

export default function FeedbackCard({ review }) {
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
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
        className={`w-10 h-10 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
      {/* Header */}
      <div className="flex items-start space-x-3 mb-4">
        <UserAvatar name={review.customerName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-800 truncate">
              {review.customerName}
            </h3>
            <span className="text-xs text-gray-500 ml-2">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <StarRating rating={review.rating} />
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 mb-4">
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Delivery Review</span>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          Helpful
        </button>
      </div>
    </div>
  );
}
