const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true },
  name: { type: String, required: true },
  designation: { type: String },
  epfNo: { type: String },
  bankName: { type: String },
  accountNo: { type: String },
  bankBranch: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
