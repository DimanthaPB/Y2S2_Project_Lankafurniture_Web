import formatDate from "../../utils/formatDate";

export default function FeedbackTable({ items }) {
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
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
    ];
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

    return (
      <div
        className={`w-8 h-8 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold text-xs`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-800">
          Customer Feedback
        </h3>
      </div>

      {items.length === 0 ? (
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
            No feedback yet
          </h3>
          <p className="text-gray-500">
            Customer feedback will appear here once submitted.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {items.map((f) => (
            <div
              key={f._id}
              className="p-6 transition-colors duration-200 hover:bg-gray-50"
            >
              <div className="flex items-start space-x-4">
                <UserAvatar name={f.customerName} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {f.customerName}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Team: {f.teamId?.name || f.teamId}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={f.rating} />
                      <span className="text-sm text-gray-600">
                        ({f.rating}/5)
                      </span>
                    </div>
                  </div>

                  {f.comment && (
                    <div className="p-3 mb-3 border-l-4 border-blue-500 rounded-lg bg-gray-50">
                      <p className="text-sm leading-relaxed text-gray-700">
                        {f.comment}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDate(f.createdAt)}
                    </span>
                    <button className="font-medium text-blue-600 hover:text-blue-700">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
