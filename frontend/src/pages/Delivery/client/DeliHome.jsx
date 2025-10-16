import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import deliveryTeamService from "../../../services/deliveryTeamService";
import HeroSection from "../../../components/Delivery/client/HeroSection";
import TrackingForm from "../../../components/Delivery/client/TrackingForm";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);
        const teamsData = await deliveryTeamService.getAll();
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (error) {
        console.error("Error fetching teams:", error);
        // Fallback to empty array if API fails
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <HeroSection />
        </div>

        {/* Quick Track Section */}
        <div className="mb-16">
          <TrackingForm />
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <div
            onClick={() => navigate("/track")}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-6 h-6 text-white"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Real-time Tracking
            </h3>
            <p className="text-gray-600">
              Monitor your delivery status with live updates and precise
              location tracking.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Experience lightning-fast delivery with our optimized route
              management system.
            </p>
          </div>

          <div
            onClick={() => navigate("/feedback")}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-6 h-6 text-white"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Easy Feedback
            </h3>
            <p className="text-gray-600">
              Share your experience and help us improve our service quality.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                99.8%
              </div>
              <div className="text-gray-600">Delivery Success</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Support Available</div>
            </div>
            <div
              onClick={() =>
                teams.length > 0 &&
                navigate(`/reviews/${teams[0]._id || teams[0].id}`)
              }
              className={`${teams.length > 0 ? "cursor-pointer" : "cursor-default"
                } hover:bg-gray-50 p-4 rounded-lg transition-colors duration-200`}
            >
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                15min
              </div>
              <div className="text-gray-600">Average Delivery</div>
              {teams.length > 0 && (
                <div className="text-xs text-blue-600 mt-1">
                  View Team Reviews →
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Reviews Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Our Delivery Teams
          </h2>

          {loadingTeams ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : teams.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.slice(0, 6).map((team) => (
                <div
                  key={team._id || team.id}
                  onClick={() => navigate(`/reviews/${team._id || team.id}`)}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {team.name || `Team ${team._id || team.id}`}
                    </h3>
                    <div className="flex items-center text-yellow-400">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {team.rating ||
                          `4.${Math.floor(Math.random() * 5 + 5)}`}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {team.description ||
                      team.specialization ||
                      `Specialized in ${team.role || "General Delivery"}`}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium group-hover:text-blue-700">
                      View Reviews →
                    </span>
                    <span className="text-xs text-gray-500">
                      {team.reviewCount || Math.floor(Math.random() * 50 + 20)}{" "}
                      reviews
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-100 text-center">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Teams Available
              </h3>
              <p className="text-gray-600">
                Our delivery teams are currently being updated. Please check
                back later.
              </p>
            </div>
          )}

          {teams.length > 6 && (
            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/teams")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                View All Teams ({teams.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
