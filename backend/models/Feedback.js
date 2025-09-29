import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryTeam",
      required: true,
      index: true,
    },
    customerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
