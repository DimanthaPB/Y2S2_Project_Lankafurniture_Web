import Feedback from "../models/Feedback.js";
import DeliveryTeam from "../models/DeliveryTeam.js";
import { ok, fail } from "../utils/responseHandler.js";

export const createFeedback = async (req, res) => {
  try {
    const { teamId, customerName, rating, comment } = req.body;
    const team = await DeliveryTeam.findById(teamId);
    if (!team) return fail(res, "Delivery team not found", 400);

    const fb = await Feedback.create({ teamId, customerName, rating, comment });
    return ok(res, fb, 201);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const getAllFeedback = async (_req, res) => {
  try {
    const list = await Feedback.find().populate("teamId");
    return ok(res, list);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const getFeedbackByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await DeliveryTeam.findById(teamId);
    if (!team) return fail(res, "Delivery team not found", 404);

    const list = await Feedback.find({ teamId }).sort({ createdAt: -1 });
    return ok(res, list);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};
