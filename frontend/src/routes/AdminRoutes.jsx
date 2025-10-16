import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DeliDashboard from "./pages/Delivery/admin/Dashboard";
import Teams from "./pages/Delivery/admin/Teams";
import Members from "./pages/Delivery/admin/Members";
import Tracking from "./pages/Delivery/admin/Tracking";
import Feedback from "./pages/Delivery/admin/Feedback";


export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="deliDashboard" element={<DeliDashboard />} />
        <Route path="teams" element={<Teams />} />
        <Route path="members" element={<Members />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>
    </Routes>
  );
}
