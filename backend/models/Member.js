import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true }, // e.g., Rider, Driver, Dispatcher
    phone: { type: String, required: true, trim: true },
    assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryTeam" },
  },
  { timestamps: true }
);

export default mongoose.model("Member", MemberSchema);
