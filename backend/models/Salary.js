const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  basic: { type: Number, required: true },
  allowances: {
    costOfLiving: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    conveyance: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
  },
  reimbursements: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  deductions: {
    noPayLeave: { type: Number, default: 0 },
    salaryAdvance: { type: Number, default: 0 },
    epfEmployer: { type: Number, default: 0 },
  },
  totals: {
    totalAllowances: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    amountInWords: { type: String, default: '' },
  },
  attendance: {
    workingDays: { type: Number, default: 0 },
    leaveTaken: { type: Number, default: 0 },
    noPayLeave: { type: Number, default: 0 },
  }
});

module.exports = mongoose.model('Salary', SalarySchema);
