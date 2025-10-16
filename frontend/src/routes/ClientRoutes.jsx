import { Routes, Route } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import Home from "../pages/client/Home";
import TrackOrder from "../pages/client/TrackOrder";
import FeedbackForm from "../pages/client/FeedbackForm";
import TeamReviews from "../pages/client/TeamReviews";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="track" element={<TrackOrder />} />
        <Route path="feedback" element={<FeedbackForm />} />
        <Route path="reviews/:teamId" element={<TeamReviews />} />
      </Route>
    </Routes>
  );
}
