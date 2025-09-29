import { useState, useEffect } from "react";

export default function MemberModal({
  isOpen,
  onClose,
  onSave,
  member = null,
  teams = [],
}) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    phone: "",
    assignedTeam: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        role: member.role || "",
        phone: member.phone || "",
        assignedTeam: member.assignedTeam?._id || "",
      });
    } else {
      setForm({ name: "", role: "", phone: "", assignedTeam: "" });
    }
    setErrors({});
  }, [member, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(form);
      setForm({ name: "", role: "", phone: "", assignedTeam: "" });
      onClose();
    } catch (error) {
      console.error("Error saving member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity bg-gray-600 bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-md transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {member ? "Edit Member" : "Add New Member"}
              </h3>
              <button
                onClick={onClose}
                className="text-white transition-colors duration-200 hover:text-gray-200"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter member's full name"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                value={form.role}
                onChange={(e) => {
                  setForm({ ...form, role: e.target.value });
                  if (errors.role) setErrors({ ...errors, role: "" });
                }}
              >
                <option value="">Select a role</option>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Support">Support</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Assigned Team Field */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Assigned Team
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.assignedTeam}
                onChange={(e) =>
                  setForm({ ...form, assignedTeam: e.target.value })
                }
              >
                <option value="">No Team (Unassigned)</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Member can be assigned to a team later if needed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex pt-4 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors duration-200 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2 -ml-1 animate-spin"
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
                    Saving...
                  </div>
                ) : member ? (
                  "Update Member"
                ) : (
                  "Add Member"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
