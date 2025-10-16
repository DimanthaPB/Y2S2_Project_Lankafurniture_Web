const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  providerId: { type: String, required: true }, // service provider ID
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rating", ratingSchema);
