import Member from "../models/Member.js";
import DeliveryTeam from "../models/DeliveryTeam.js";
import { ok, fail } from "../utils/responseHandler.js";

export const createMember = async (req, res) => {
  try {
    const { name, role, phone, assignedTeam } = req.body;
    if (assignedTeam) {
      const team = await DeliveryTeam.findById(assignedTeam);
      if (!team) return fail(res, "Assigned team not found", 400);
    }
    const member = await Member.create({
      name,
      role,
      phone,
      assignedTeam: assignedTeam || null,
    });

    // If assignedTeam provided, append to team.members
    if (assignedTeam) {
      await DeliveryTeam.findByIdAndUpdate(assignedTeam, {
        $addToSet: { members: member._id },
      });
    }

    return ok(res, member, 201);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const getMembers = async (_req, res) => {
  try {
    const members = await Member.find().populate("assignedTeam");
    return ok(res, members);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate(
      "assignedTeam"
    );
    if (!member) return fail(res, "Member not found", 404);
    return ok(res, member);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const updateMember = async (req, res) => {
  try {
    const { name, role, phone, assignedTeam } = req.body;
    const member = await Member.findById(req.params.id);
    if (!member) return fail(res, "Member not found", 404);

    // If changing team, update both sides
    if (assignedTeam !== undefined) {
      if (assignedTeam) {
        const team = await DeliveryTeam.findById(assignedTeam);
        if (!team) return fail(res, "Assigned team not found", 400);
      }
      // remove from previous team.members
      if (member.assignedTeam) {
        await DeliveryTeam.findByIdAndUpdate(member.assignedTeam, {
          $pull: { members: member._id },
        });
      }
      // add to new team.members
      if (assignedTeam) {
        await DeliveryTeam.findByIdAndUpdate(assignedTeam, {
          $addToSet: { members: member._id },
        });
      }
      member.assignedTeam = assignedTeam || null;
    }

    if (name !== undefined) member.name = name;
    if (role !== undefined) member.role = role;
    if (phone !== undefined) member.phone = phone;
    await member.save();

    const populated = await member.populate("assignedTeam");
    return ok(res, populated);
  } catch (err) {
    return fail(res, err.message, 400);
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return fail(res, "Member not found", 404);

    // Pull from team.members if linked
    if (member.assignedTeam) {
      await DeliveryTeam.findByIdAndUpdate(member.assignedTeam, {
        $pull: { members: member._id },
      });
    }

    await member.deleteOne();
    return ok(res, { message: "Member deleted" });
  } catch (err) {
    return fail(res, err.message, 400);
  }
};
