const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  // Customer Information
  customerName: { 
    type: String, 
    required: true,
    trim: true
  },
  customerEmail: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  customerPhone: {
    type: String,
    trim: true
  },
  customerLocation: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // Job Details
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
  category: {
    type: String,
    required: true,
    enum: ['Cleaning', 'Repair', 'Installation', 'Maintenance', 'Other'],
    default: 'Other'
  },
  skillsRequired: [{
    type: String,
    trim: true
  }],
  budget: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Provider Information
  providerId: {
    type: String,
    index: true
  },
  providerName: {
    type: String,
    trim: true
  },
  
  // Status and Timestamps
  status: { 
    type: String, 
    enum: ["New", "In Progress", "Completed", "Cancelled", "On Hold"], 
    default: "New" 
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    default: "Medium"
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  estimatedHours: {
    type: Number,
    min: 0
  },
  
  // System Fields
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  notes: [{
    content: String,
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Update the updatedAt field on save
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
jobSchema.index({ status: 1, priority: -1 });
jobSchema.index({ providerId: 1, status: 1 });
jobSchema.index({ customerEmail: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for job duration in days
jobSchema.virtual('durationInDays').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

module.exports = mongoose.model("Job", jobSchema);
