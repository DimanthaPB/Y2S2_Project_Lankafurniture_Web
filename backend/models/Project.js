const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  providerId: { 
    type: String, 
    required: true,
    index: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    enum: ["Pending", "Ongoing", "Completed"], 
    default: "Ongoing" 
  },
  category: { 
    type: String, 
    default: "General"
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for better query performance
projectSchema.index({ providerId: 1, status: 1 });

module.exports = mongoose.model("Project", projectSchema);

