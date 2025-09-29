import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
            {/* 404 Icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20.5a7.962 7.962 0 01-5.657-2.343m0 0L9.172 15.328M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Page Not Found
              </h2>
            </div>

            {/* Message */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been
              moved, deleted, or you entered the wrong URL.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Go Back
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg font-semibold border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
              >
                Return Home
              </button>
            </div>

            {/* Help Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Need help?</p>
              <div className="flex justify-center space-x-4 text-sm">
                <button
                  onClick={() => navigate('/track')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Track Order
                </button>
                <span className="text-gray-300">•</span>
                <button
                  onClick={() => navigate('/feedback')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
