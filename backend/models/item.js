//item.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemNo: { type: String, required: true, unique: true }, // unique item number
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  reorderLevel: { 
    type: Number, 
    required: true, 
    min: [1, "Reorder level must be at least 1"] 
  },
}, { timestamps: true });

module.exports = mongoose.model("Item", ItemSchema);


