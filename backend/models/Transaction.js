const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  providerId: { 
    type: String, 
    required: true,
    index: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['credit', 'debit', 'refund', 'payment'],
    default: 'payment'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  reference: {
    type: String,
    unique: true,
    sparse: true
  },
  description: { 
    type: String,
    trim: true
  },
  date: { 
    type: Date, 
    default: Date.now,
    index: true 
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
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate a reference if not provided
  if (!this.reference) {
    this.reference = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  next();
});

// Create indexes for better query performance
transactionSchema.index({ providerId: 1, date: -1 });
transactionSchema.index({ type: 1, status: 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.amount);
});

module.exports = mongoose.model("Transaction", transactionSchema);
