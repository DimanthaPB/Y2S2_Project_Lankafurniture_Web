import mongoose from "mongoose";

const DeliveryTeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    ],
  },
  { timestamps: true }
);

// Ensure at least one member
DeliveryTeamSchema.pre("validate", function (next) {
  if (!this.members || this.members.length < 1) {
    this.invalidate(
      "members",
      "A delivery team must have at least one member."
    );
  }
  next();
});

export default mongoose.model("DeliveryTeam", DeliveryTeamSchema);
