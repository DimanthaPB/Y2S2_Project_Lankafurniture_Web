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

// 🔹 Generate payslip PDF for a salary record (two-column incomes vs deductions)
router.get('/:id/payslip', protect, async (req, res) => {
  try {
    //  Fetch salary and employee data
    const salary = await Salary.findById(req.params.id);
    if (!salary) return res.status(404).json({ message: 'Salary not found' });

    const employee = await Employee.findById(salary.employeeId);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Utilities
    const fmt = (v) => {
      const n = Number(v) || 0;
      return 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    //  Initialize PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="payslip_${salary._id}.pdf"`);
    doc.pipe(res);

    //  Add logo if available
    const logoPath = path.resolve('assets/logo.jpg');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 44, 45, { width: 60 });
    }

    // Header - Company info and payslip title
    doc.font('Helvetica-Bold').fontSize(16).text('LankaFurniture Pvt Ltd', 120, 48);
    doc.font('Helvetica').fontSize(9).fillColor('#444')
      .text('215/1, New Kandy Road, Malabe, Sri Lanka', 120, 68)
      .text('Phone: +94703914047 | Email: hr@lankafurniture.com', 120, 80);

    doc.fontSize(14).fillColor('#000').font('Helvetica-Bold');
    doc.text(`Payslip • ${salary.month} ${salary.year}`, { align: 'right' });

    // Small separator
    doc.moveTo(40, 110).lineTo(555, 110).strokeColor('#e6e6e6').stroke();

    // Employee details block
    const empStartY = 120;
    doc.fontSize(10).fillColor('#333').font('Helvetica-Bold')
      .text(employee.name || '-', 50, empStartY);
    doc.font('Helvetica').fontSize(9).fillColor('#666')
      .text(`${employee.designation || '-'}  •  ${employee.department || ''}`, 50, empStartY + 14);

    // Right side small meta
    doc.fontSize(9).fillColor('#333').font('Helvetica-Bold');
    doc.text('Employee ID:', 400, empStartY);
    doc.font('Helvetica').fillColor('#000').text(employee.employeeId || '-', 470, empStartY);
    doc.font('Helvetica-Bold').fillColor('#333').text('EPF No:', 400, empStartY + 14);
    doc.font('Helvetica').fillColor('#000').text(employee.epfNo || '-', 470, empStartY + 14);
    doc.font('Helvetica-Bold').fillColor('#333').text('Generated:', 400, empStartY + 28);
    doc.font('Helvetica').fillColor('#000').text(new Date().toLocaleDateString(), 470, empStartY + 28);

    // Move cursor below employee block
    let y = empStartY + 50;

    // Two-column layout: left = incomes/earnings, right = deductions
    const leftX = 50;
    const rightX = 320;
    const colW = 220;
    const rowH = 20;

    // Section headers background
    doc.roundedRect(leftX - 6, y - 6, colW + 12, 26, 4).fillOpacity(0.95).fillAndStroke('#f3f8ff', '#e6f0ff').fillOpacity(1);
    doc.roundedRect(rightX - 6, y - 6, colW + 12, 26, 4).fillOpacity(0.95).fillAndStroke('#fff6f6', '#fde6e6').fillOpacity(1);

    doc.font('Helvetica-Bold').fillColor('#0b63d6').fontSize(11).text('Earnings', leftX, y - 2);
    doc.font('Helvetica-Bold').fillColor('#d04444').fontSize(11).text('Deductions', rightX, y - 2);

    y += 30;

    // Prepare rows
    const incomes = [
      ['Basic Salary', salary.basic],
      ['Cost of Living', salary.allowances?.costOfLiving],
      ['Food Allowance', salary.allowances?.food],
      ['Conveyance', salary.allowances?.conveyance],
      ['Medical Allowance', salary.allowances?.medical],
      ['Bonus', salary.bonus],
      ['Reimbursements', salary.reimbursements],
    ].map(([l, v]) => [l, fmt(v)]);

    const deductions = [
      ['No Pay Leave', salary.deductions?.noPayLeave],
      ['Salary Advance', salary.deductions?.salaryAdvance],
      ['EPF Employer', salary.deductions?.epfEmployer],
    ].map(([l, v]) => {
      // "No Pay Leave" is a count (not a currency) — show plain number (or '-' if missing)
      if (l === 'No Pay Leave') {
        return [l, (v == null || v === '') ? '-' : String(Number(v))];
      }
      return [l, fmt(v)];
    });

    const maxRows = Math.max(incomes.length, deductions.length);

    doc.fontSize(9).font('Helvetica');
    for (let i = 0; i < maxRows; i++) {
      const rowY = y + i * rowH;
      // left column row box
      doc.rect(leftX - 6, rowY - 4, colW + 12, rowH + 6).stroke('#f0f0f0').stroke();
      if (incomes[i]) {
        doc.font('Helvetica').fillColor('#444').text(incomes[i][0], leftX, rowY);
        doc.font('Helvetica-Bold').fillColor('#000').text(incomes[i][1], leftX, rowY, { width: colW - 6, align: 'right' });
      }

      // right column row box
      doc.rect(rightX - 6, rowY - 4, colW + 12, rowH + 6).stroke('#f0f0f0').stroke();
      if (deductions[i]) {
        doc.font('Helvetica').fillColor('#444').text(deductions[i][0], rightX, rowY);
        doc.font('Helvetica-Bold').fillColor('#000').text(deductions[i][1], rightX, rowY, { width: colW - 6, align: 'right' });
      }
    }

    // Move y past rows
    y = y + maxRows * rowH + 12;

    // Totals box spanning both columns
    const totalsX = 50;
    const totalsW = 490;
    doc.roundedRect(totalsX, y, totalsW, 76, 6).fillAndStroke('#ffffff', '#e9eef7');
    // inner dividing line
    doc.moveTo(totalsX + 8, y + 36).lineTo(totalsX + totalsW - 8, y + 36).strokeColor('#f0f4fb').stroke();

    // left side totals (Gross and Total Deductions)
    doc.fontSize(10).font('Helvetica').fillColor('#444').text('Gross Pay', totalsX + 12, y + 8);
    doc.font('Helvetica-Bold').fillColor('#000').text(fmt(salary.totals?.grossSalary), totalsX + 12, y + 8, { align: 'right', width: 220 });

    doc.font('Helvetica').fontSize(10).fillColor('#444').text('Total Deductions', totalsX + 12, y + 28);
    doc.font('Helvetica-Bold').fillColor('#000').text(fmt(salary.totals?.totalDeductions), totalsX + 12, y + 28, { align: 'right', width: 220 });

    // right side net pay emphasized
    doc.font('Helvetica').fontSize(10).fillColor('#444').text('Net Pay', totalsX + 260, y + 8);
    doc.font('Helvetica-Bold').fontSize(18).fillColor('#0b6f3a')
      .text(fmt(salary.totals?.netSalary), totalsX + 260, y + 10, { align: 'right', width: 220 });

    // amount in words
    doc.font('Helvetica').fontSize(9).fillColor('#666').text('Amount (in words):', totalsX + 12, y + 48);
    doc.font('Helvetica').fontSize(9).fillColor('#000').text(salary.totals?.amountInWords || '-', totalsX + 120, y + 48);

    // Signature area
    const sigY = y + 96;
    doc.moveTo(50, sigY).lineTo(220, sigY).strokeColor('#bbb').stroke();
    doc.fontSize(9).fillColor('#666').text('Authorized Signature', 50, sigY + 6);

    // Finalize PDF
    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Error generating payslip', error: err.message });
  }
});

module.exports = router;
