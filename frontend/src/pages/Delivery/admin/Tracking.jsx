import { useEffect, useState } from "react";
import trackingService from "../../../services/trackingService";
import deliveryTeamService from "../../../services/deliveryTeamService";
import TrackingTable from "../../../components/Delivery/admin/TrackingTable";
import Modal from "../../../components/Delivery/shared/Modal";
import Button from "../../../components/Delivery/shared/Button";

export default function Tracking() {
  const [items, setItems] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    orderId: "",
    teamId: "",
    status: "PENDING",
    note: "",
  });

  const load = async () => {
    const [list, t] = await Promise.all([
      trackingService.list(),
      deliveryTeamService.getAll(),
    ]);
    setItems(list);
    setTeams(t);
  };

  useEffect(() => {
    load();
  }, []);

  const upsert = async () => {
    if (!form.orderId || !form.teamId) {
      return alert("Order ID and Team are required");
    }
    await trackingService.upsert(form);
    setOpen(false);
    setForm({ orderId: "", teamId: "", status: "PENDING", note: "" });
    load();
  };

  const updateRow = async (orderId, payload) => {
    await trackingService.upsert({ orderId, ...payload });
    load();
  };

  const remove = async (orderId) => {
    if (!window.confirm("Delete this tracking item?")) return;
    await trackingService.remove(orderId);
    load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Tracking Management
        </h1>
        <Button onClick={() => setOpen(true)}>Create Tracking Entry</Button>
      </div>

      {/* Tracking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order Status Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Transit</span>
              <span className="text-sm font-medium">42</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Delivered</span>
              <span className="text-sm font-medium">128</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Tracking Updates
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Order #ORD{1000 + i}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated location - Team {i}
                  </p>
                </div>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create / Update Tracking"
      >
        <div className="space-y-3">
          <input
            className="border p-2 w-full rounded"
            placeholder="Order ID"
            value={form.orderId}
            onChange={(e) => setForm({ ...form, orderId: e.target.value })}
          />
          <select
            className="border p-2 w-full rounded"
            value={form.teamId}
            onChange={(e) => setForm({ ...form, teamId: e.target.value })}
          >
            <option value="">— Select Team —</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <select
            className="border p-2 w-full rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {[
              "PENDING",
              "ASSIGNED",
              "OUT_FOR_DELIVERY",
              "DELIVERED",
              "CANCELLED",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <textarea
            className="border p-2 w-full rounded"
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <Button onClick={upsert} className="w-full">
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}
