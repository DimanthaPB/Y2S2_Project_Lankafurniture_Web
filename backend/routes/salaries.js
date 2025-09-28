const express = require('express');
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');
const authMiddleware = require('../middleware/authMiddleware');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const numberToWords = require('number-to-words');

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// 🔹 Helper function to calculate totals
const calculateSalary = (salary) => {
  const totalAllowances = 
    (salary.allowances?.costOfLiving || 0) +
    (salary.allowances?.food || 0) +
    (salary.allowances?.conveyance || 0) +
    (salary.allowances?.medical || 0);

  const grossSalary = salary.basic + totalAllowances;
  const totalEarnings = grossSalary + (salary.reimbursements || 0) + (salary.bonus || 0);

  const totalDeductions = 
    (salary.deductions?.noPayLeave || 0) +
    (salary.deductions?.salaryAdvance || 0) +
    (salary.deductions?.epfEmployer || 0);

  const netSalary = totalEarnings - totalDeductions;

  salary.totals = {
    totalAllowances,
    grossSalary,
    totalEarnings,
    totalDeductions,
    netSalary,
    amountInWords: `${numberToWords.toWords(Math.floor(netSalary))} Rupees`
  };

  return salary;
};

// 🔹 Get all salaries for an employee
router.get('/:employeeId', protect, async (req, res) => {
  try {
    const salaries = await Salary.find({ employeeId: req.params.employeeId });
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Create salary record
router.post('/', protect, async (req, res) => {
  try {
    let salary = new Salary(req.body);
    salary = calculateSalary(salary);
    await salary.save();
    res.json(salary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Update salary
router.put('/:id', protect, async (req, res) => {
  try {
    let salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });

    Object.assign(salary, req.body);
    salary = calculateSalary(salary);
    await salary.save();

    res.json(salary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Delete salary
router.delete('/:id', protect, async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });
    res.json({ message: 'Salary deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Generate payslip PDF for a salary record
router.get('/:id/payslip', protect, async (req, res) => {
  try {
    //  Fetch salary and employee data
    const salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });

    const employee = await Employee.findById(salary.employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    //  Initialize PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    doc.pipe(res);

    //  Add logo if available
    const logoPath = path.resolve('assets/logo.jpg');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 60 });
    }

    //  Company Info
    doc
      .fontSize(20)
      .text('LankaFurniture Pvt Ltd', 120, 50)
      .fontSize(10)
      .text('215/1, New Kandy Road, Malabe, Sri Lanka', 120, 75)
      .text('Phone: +94703914047 | Email: hr@lankafurniture.com', 120, 90);

    //  Payslip Title
    doc.moveDown();
    doc
      .fontSize(16)
      .text(`Payslip - ${salary.month} ${salary.year}`, { align: 'center', underline: true });
    doc.moveDown();

    //  Table Drawing Utility
    const drawTable = (rows, startY) => {
      let y = startY;
      const rowHeight = 20;
      const col1Width = 150;
      const col2Width = 350;

      rows.forEach(([label, value]) => {
        doc.rect(50, y, col1Width, rowHeight).stroke();
        doc.rect(50 + col1Width, y, col2Width, rowHeight).stroke();
        doc.fontSize(10).text(label, 55, y + 5);
        doc.fontSize(10).text(value || '-', 55 + col1Width, y + 5);
        y += rowHeight;
      });

      return y;
    };

    //  Employee Details
    const employeeDetails = [
      ['Employee Name', employee.name],
      ['Employee ID', employee.employeeId],
      ['Designation', employee.designation],
      ['EPF No', employee.epfNo],
      ['Bank', employee.bankName],
      ['Account No', employee.accountNo],
    ];
    let currentY = drawTable(employeeDetails, doc.y + 20);

    //  Earnings Section
    doc.moveDown(2).fontSize(14).text('Salary Breakdown', { underline: true });
    currentY += 40;

    const earnings = [
      ['Basic Salary', salary.basic],
      ['Cost of Living', salary.allowances?.costOfLiving],
      ['Food Allowance', salary.allowances?.food],
      ['Conveyance', salary.allowances?.conveyance],
      ['Medical Allowance', salary.allowances?.medical],
      ['Bonus', salary.bonus],
      ['Reimbursements', salary.reimbursements],
    ];
    currentY = drawTable(earnings, currentY + 10);

    //  Deductions Section
    doc.moveDown().fontSize(14).text('Deductions', { underline: true });
    currentY += 40;

    const deductions = [
      ['No Pay Leave', salary.deductions?.noPayLeave],
      ['Salary Advance', salary.deductions?.salaryAdvance],
      ['EPF Employer', salary.deductions?.epfEmployer],
    ];
    currentY = drawTable(deductions, currentY + 10);

    //  Totals Section
    doc.moveDown().fontSize(14).text('Totals', { underline: true });
    currentY += 40;

    const totals = [
      ['Total Allowances', salary.totals?.totalAllowances],
      ['Gross Salary', salary.totals?.grossSalary],
      ['Total Deductions', salary.totals?.totalDeductions],
      ['Net Salary', salary.totals?.netSalary],
      ['Amount in Words', salary.totals?.amountInWords],
    ];
    currentY = drawTable(totals, currentY + 10);

    //  Signature
    doc.moveDown(4);
    doc.fontSize(12).text('_________________________', 50, currentY + 20);
    doc.text('Authorized Signature', 50, currentY + 40);

    //  Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Error generating payslip', error: err.message });
  }
});

module.exports = router;
