import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import DeliveryTeam from "../models/DeliveryTeam.js";
import Member from "../models/Member.js";
import Feedback from "../models/Feedback.js";
import Tracking from "../models/Tracking.js";

const run = async () => {
  await connectDB();
  await Promise.all([
    DeliveryTeam.deleteMany({}),
    Member.deleteMany({}),
    Feedback.deleteMany({}),
    Tracking.deleteMany({}),
  ]);

  const members = await Member.insertMany([
    { name: "Kamal Perera", role: "Rider", phone: "0771234567" },
    { name: "Nadeesha Silva", role: "Driver", phone: "0719876543" },
    { name: "Tharindu Jayasuriya", role: "Rider", phone: "0755555555" },
  ]);

  const teamA = await DeliveryTeam.create({
    name: "Colombo Central Team",
    description: "Covers Colombo 01–15",
    members: [members[0]._id, members[1]._id],
  });
  const teamB = await DeliveryTeam.create({
    name: "Kandy Express",
    description: "Hill Country deliveries",
    members: [members[2]._id],
  });

  await Member.findByIdAndUpdate(members[0]._id, { assignedTeam: teamA._id });
  await Member.findByIdAndUpdate(members[1]._id, { assignedTeam: teamA._id });
  await Member.findByIdAndUpdate(members[2]._id, { assignedTeam: teamB._id });

  await Feedback.insertMany([
    {
      teamId: teamA._id,
      customerName: "Ishara",
      rating: 5,
      comment: "Fast and friendly!",
    },
    {
      teamId: teamA._id,
      customerName: "Ruwan",
      rating: 4,
      comment: "On time delivery.",
    },
    {
      teamId: teamB._id,
      customerName: "Nimali",
      rating: 5,
      comment: "Great service in Kandy.",
    },
  ]);

  await Tracking.insertMany([
    {
      orderId: "ORD-1001",
      teamId: teamA._id,
      status: "OUT_FOR_DELIVERY",
      note: "Left warehouse",
    },
    {
      orderId: "ORD-1002",
      teamId: teamB._id,
      status: "ASSIGNED",
      note: "Packed",
    },
  ]);

  console.log("Seeded sample data");
  await mongoose.connection.close();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
