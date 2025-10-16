import DeliveryTeam from "../models/DeliveryTeam.js";
import Member from "../models/Member.js";
import { ok, fail } from "../utils/responseHandler.js";

export const createTeam = async (req, res) => {
  try {
    const { name, description, memberIds = [] } = req.body;
    if (!memberIds.length)
      return fail(res, "At least one memberId is required.", 400);

    // Validate members exist
    const members = await Member.find({ _id: { $in: memberIds } });
    if (members.length !== memberIds.length)
      return fail(res, "Some members not found.", 400);

    const team = await DeliveryTeam.create({
      name,
      description,
      members: memberIds,
    });

    // Back-link members to team
    await Member.updateMany(
      { _id: { $in: memberIds } },
      { assignedTeam: team._id }
    );

    const populated = await team.populate("members");
    return ok(res, populated, 201);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const getTeams = async (_req, res) => {
  try {
    const teams = await DeliveryTeam.find().populate("members");
    return ok(res, teams);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await DeliveryTeam.findById(req.params.id).populate("members");
    if (!team) return fail(res, "Team not found", 404);
    return ok(res, team);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const team = await DeliveryTeam.findById(req.params.id);
    if (!team) return fail(res, "Team not found", 404);

    if (memberIds && !memberIds.length)
      return fail(res, "A team must have at least one member.", 400);

    if (name !== undefined) team.name = name;
    if (description !== undefined) team.description = description;
    if (memberIds !== undefined) team.members = memberIds;

    await team.validate(); // enforce at least one member
    await team.save();

    // Back-link members (clear previous, set new)
    if (memberIds !== undefined) {
      await Member.updateMany(
        { assignedTeam: team._id },
        { assignedTeam: null }
      );
      await Member.updateMany(
        { _id: { $in: memberIds } },
        { assignedTeam: team._id }
      );
    }

    const populated = await team.populate("members");
    return ok(res, populated);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await DeliveryTeam.findById(req.params.id);
    if (!team) return fail(res, "Team not found", 404);

    // Unlink members
    await Member.updateMany({ assignedTeam: team._id }, { assignedTeam: null });
    await team.deleteOne();

    return ok(res, { message: "Team deleted" });
  } catch (err) {
    return fail(res, err.message, 400);
  }
};
