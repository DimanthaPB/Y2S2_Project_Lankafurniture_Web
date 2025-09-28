const Employee = require('../models/Employee');

const generateEmployeeId = async () => {
  // Find the last employee
  const lastEmployee = await Employee.findOne().sort({ createdAt: -1 });
  let newId;

  if (!lastEmployee) {
    newId = 'EMP001'; // first employee
  } else {
    const lastIdNum = parseInt(lastEmployee.employeeId.replace('EMP', ''));
    newId = 'EMP' + String(lastIdNum + 1).padStart(3, '0');
  }

  return newId;
};

module.exports = generateEmployeeId;
