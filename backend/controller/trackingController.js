import Tracking, { TRACKING_STATUS } from "../models/Tracking.js";
import DeliveryTeam from "../models/DeliveryTeam.js";
import { ok, fail } from "../utils/responseHandler.js";

export const createOrUpdateTracking = async (req, res) => {
  try {
    const { orderId, teamId, status, note } = req.body;
    if (!orderId || !teamId)
      return fail(res, "orderId and teamId are required");

    const team = await DeliveryTeam.findById(teamId);
    if (!team) return fail(res, "Delivery team not found", 400);

    if (status && !TRACKING_STATUS.includes(status)) {
      return fail(
        res,
        `Invalid status. Use one of: ${TRACKING_STATUS.join(", ")}`,
        400
      );
    }

    const doc = await Tracking.findOneAndUpdate(
      { orderId },
      { $set: { teamId, status: status || "PENDING", note: note || "" } },
      { new: true, upsert: true }
    ).populate("teamId");

    return ok(res, doc, 201);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const getTrackingByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const tr = await Tracking.findOne({ orderId }).populate("teamId");
    if (!tr) return fail(res, "Tracking not found", 404);
    return ok(res, tr);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const listTracking = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const list = await Tracking.find(filter)
      .populate("teamId")
      .sort({ updatedAt: -1 });
    return ok(res, list);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const deleteTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const tr = await Tracking.findOne({ orderId });
    if (!tr) return fail(res, "Tracking not found", 404);
    await tr.deleteOne();
    return ok(res, { message: "Tracking deleted" });
  } catch (err) {
    return fail(res, err.message, 400);
  }
};
