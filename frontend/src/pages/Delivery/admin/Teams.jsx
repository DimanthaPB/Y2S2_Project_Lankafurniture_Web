import { useEffect, useState } from "react";
import deliveryTeamService from "../../../services/deliveryTeamService";
import memberService from "../../../services/memberService";
import TeamTable from "../../../components/Delivery/admin/TeamTable";
import Modal from "../../../components/Delivery/shared/Modal";
import Button from "../../../components/Delivery/shared/Button";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    memberIds: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [t, m] = await Promise.all([
        deliveryTeamService.getAll(),
        memberService.getAll(),
      ]);
      setTeams(Array.isArray(t) ? t : []);
      setMembers(m);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Team name is required" });
      return;
    }
    if (form.memberIds.length < 1) {
      setMessage({ type: "error", text: "At least one member is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      await deliveryTeamService.create(form);
      setOpen(false);
      setForm({ name: "", description: "", memberIds: [] });
      setMessage({ type: "success", text: "Team created successfully!" });
      load();

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to create team. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = async (id, payload) => {
    await deliveryTeamService.update(id, payload);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this team?")) return;
    await deliveryTeamService.remove(id);
    load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teams Management</h1>
          <p className="text-gray-600">Create and manage delivery teams</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="shadow-lg"
        >
          <div className="flex items-center">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Team
          </div>
        </Button>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div
          className={`p-4 rounded-lg border animate-fade-in ${message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
            }`}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Teams</h3>
              <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
              <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
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
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Teams</h3>
              <p className="text-2xl font-bold text-gray-900">
                {teams.filter((t) => t.members?.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      {loading ? (
        <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-xl">
          <div className="space-y-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <TeamTable
          teams={teams}
          members={members}
          onUpdate={update}
          onDelete={remove}
        />
      )}

      {/* Create Team Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create New Team"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Team Name *
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter team name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter team description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-3 text-sm font-medium text-gray-700">
              Select Team Members *
            </label>
            <div className="p-4 overflow-y-auto border border-gray-300 rounded-lg max-h-64 bg-gray-50">
              {members.length === 0 ? (
                <p className="py-4 text-center text-gray-500">
                  No members available
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {members.map((m) => (
                    <label
                      key={m._id}
                      className="flex items-center p-2 space-x-3 rounded-lg cursor-pointer hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={form.memberIds.includes(m._id)}
                        onChange={(e) => {
                          const set = new Set(form.memberIds);
                          e.target.checked ? set.add(m._id) : set.delete(m._id);
                          setForm({ ...form, memberIds: Array.from(set) });
                        }}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {m.name}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          — {m.role}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Selected:{" "}
              {form.memberIds.length} member
              {form.memberIds.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex pt-4 space-x-3">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={create}
              className="flex-1"
              disabled={isSubmitting}
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
                  Creating...
                </div>
              ) : (
                "Create Team"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
