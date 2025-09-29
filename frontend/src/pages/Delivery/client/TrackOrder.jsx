import { useState } from "react";
import trackingService from "../../../services/trackingService";
import TrackingForm from "../../../components/Delivery/client/TrackingForm";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError("Please enter an Order ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setTracking(null);

    try {
      const data = await trackingService.getTracking(orderId);
      setTracking(data);
    } catch (e) {
      setError("Order not found. Please check your Order ID and try again.");
      setTracking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusProgress = (status) => {
    const statuses = [
      "pending",
      "confirmed",
      "preparing",
      "on_the_way",
      "delivered",
    ];
    const currentIndex = statuses.indexOf(status?.toLowerCase());
    return currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 0;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <svg
            className="w-6 h-6"
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
        );
      case "confirmed":
        return (
          <svg
            className="w-6 h-6"
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
        );
      case "preparing":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        );
      case "on_the_way":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 17l4 4 4-4m-4-5v9"
            />
          </svg>
        );
      case "delivered":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "preparing":
        return "text-orange-600 bg-orange-100";
      case "on_the_way":
        return "text-purple-600 bg-purple-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-gray-600">
              Enter your order ID to get real-time updates on your delivery
              status.
            </p>
          </div>

          {/* Quick Track Component */}
          <div className="mb-8">
            <TrackingForm />
          </div>

          {/* Main Search Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Order Tracking
              </h2>
            </div>

            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${error
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 focus:border-blue-500"
                      }`}
                    value={orderId}
                    onChange={(e) => {
                      setOrderId(e.target.value);
                      if (error) setError("");
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your order ID (e.g., ORD123456)"
                  />
                  {error && (
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
                      {error}
                    </p>
                  )}
                </div>
                <div className="md:mt-7">
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className={`w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${isLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
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
                        Tracking...
                      </div>
                    ) : (
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        Track Order
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Results */}
          {tracking && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
              <div className="p-8">
                {/* Order Info Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Order Details
                    </h3>
                    <p className="text-gray-600">
                      Order ID:{" "}
                      <span className="font-semibold text-gray-800">
                        {tracking.orderId}
                      </span>
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mt-4 md:mt-0 ${getStatusColor(
                      tracking.status
                    )}`}
                  >
                    {getStatusIcon(tracking.status)}
                    <span className="ml-2 capitalize">{tracking.status}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Progress
                    </span>
                    <span className="text-sm text-gray-600">
                      {Math.round(getStatusProgress(tracking.status))}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${getStatusProgress(tracking.status)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="grid md:grid-cols-5 gap-4 mb-8">
                  {[
                    "Pending",
                    "Confirmed",
                    "Preparing",
                    "On the Way",
                    "Delivered",
                  ].map((status, index) => {
                    const isActive =
                      [
                        "pending",
                        "confirmed",
                        "preparing",
                        "on_the_way",
                        "delivered",
                      ].indexOf(tracking.status?.toLowerCase()) >= index;
                    return (
                      <div
                        key={status}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${isActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                          }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isActive
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-500"
                            }`}
                        >
                          {isActive ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-sm font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium text-center ${isActive ? "text-blue-700" : "text-gray-500"
                            }`}
                        >
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Info */}
                {tracking.note && (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Additional Information
                    </h4>
                    <p className="text-gray-600">{tracking.note}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={() => {
                      setOrderId("");
                      setTracking(null);
                      setError("");
                    }}
                    className="flex-1 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                  >
                    Track Another Order
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Call Support
                </h4>
                <p className="text-gray-600 text-sm">1-800-DELIVERY</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Live Chat</h4>
                <p className="text-gray-600 text-sm">Available 24/7</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
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
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Email Us</h4>
                <p className="text-gray-600 text-sm">support@deliveryapp.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
