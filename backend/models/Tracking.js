import mongoose from "mongoose";

const STATUS = [
  "PENDING",
  "ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const TrackingSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, trim: true },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryTeam",
      required: true,
    },
    status: { type: String, enum: STATUS, default: "PENDING", index: true },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export const TRACKING_STATUS = STATUS;
export default mongoose.model("Tracking", TrackingSchema);
