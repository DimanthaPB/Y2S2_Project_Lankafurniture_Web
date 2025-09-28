const convertToWords = require('./numberToWords');

const calculateSalary = (data) => {
  const allowances = data.allowances || {};
  const deductions = data.deductions || {};
  const reimbursements = data.reimbursements || 0;
  const bonus = data.bonus || 0;
  const basic = data.basic || 0;

  const totalAllowances = 
    (allowances.costOfLiving || 0) +
    (allowances.food || 0) +
    (allowances.conveyance || 0) +
    (allowances.medical || 0);

  const grossSalary = basic + totalAllowances + reimbursements + bonus;

  const totalDeductions =
    (deductions.noPayLeave || 0) +
    (deductions.salaryAdvance || 0) +
    (deductions.epfEmployer || 0);

  const netSalary = grossSalary - totalDeductions;

  return {
    totalAllowances,
    grossSalary,
    totalEarnings: grossSalary,
    totalDeductions,
    netSalary,
    amountInWords: convertToWords(netSalary)
  };
};

module.exports = calculateSalary;
