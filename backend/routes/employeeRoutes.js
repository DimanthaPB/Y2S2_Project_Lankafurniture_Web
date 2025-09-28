const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const generateEmployeeId = require('../utils/generateEmployeeId');
const { protect } = require('../middleware/authMiddleware');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// 🔹 GET all employees
router.get('/', protect, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 GET employee report as PDF
router.get('/report', protect, async (req, res) => {
  try {
    const employees = await Employee.find();
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 30 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Employee_Report.pdf');
    doc.pipe(res);

    // 🔸 Header
    const logoPath = path.resolve('assets/logo.jpg');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 30, 20, { width: 50 });
    }

    doc
      .fontSize(18)
      .text('LankaFurniture Pvt Ltd', 100, 20)
      .fontSize(9)
      .text('215/1, New Kandy Road, Malabe, Sri Lanka', 100, 40)
      .text('Phone: +94703914047 | Email: hr@lankafurniture.com', 100, 55);

    doc.moveDown().fontSize(14).text('Employee Report', { align: 'center', underline: true });
    doc.moveDown().fontSize(11).text(`Total Employees: ${employees.length}`, { align: 'center' });
    doc.moveDown();

    // 🔸 Table layout
    const tableTop = doc.y + 10;
    const rowHeight = 18;
    const colWidths = [70, 100, 100, 80, 100, 100, 100]; // Adjusted widths
    const colX = [30];
    for (let i = 0; i < colWidths.length - 1; i++) {
      colX.push(colX[i] + colWidths[i]);
    }

    // 🔸 Draw table headers
    const headers = ['Employee ID', 'Name', 'Designation', 'EPF No', 'Bank', 'Account No', 'Branch'];
    headers.forEach((header, i) => {
      doc
        .rect(colX[i], tableTop, colWidths[i], rowHeight)
        .fillAndStroke('#f3f4f6', '#cccccc')
        .fillColor('#000')
        .fontSize(9)
        .text(header, colX[i] + 4, tableTop + 5, { width: colWidths[i] - 8 });
    });

    // 🔸 Draw table rows
    let y = tableTop + rowHeight;
    employees.forEach(emp => {
      const row = [
        emp.employeeId,
        emp.name,
        emp.designation,
        emp.epfNo,
        emp.bankName,
        emp.accountNo,
        emp.bankBranch
      ];

      row.forEach((val, i) => {
        doc
          .rect(colX[i], y, colWidths[i], rowHeight)
          .stroke()
          .fillColor('#000')
          .fontSize(8)
          .text(val || '-', colX[i] + 4, y + 5, { width: colWidths[i] - 8 });
      });

      y += rowHeight;

      // 🔸 Page break if needed
      if (y > doc.page.height - 40) {
        doc.addPage({ layout: 'landscape' });
        y = 30;
      }
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
});
// 🔹 POST add new employee
router.post('/', protect, async (req, res) => {
  try {
    const { name, designation, epfNo, bankName, accountNo, bankBranch } = req.body;
    const employeeId = await generateEmployeeId();

    const newEmployee = new Employee({
      employeeId,
      name,
      designation,
      epfNo,
      bankName,
      accountNo,
      bankBranch
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 PUT update employee
router.put('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    Object.assign(employee, req.body);
    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 DELETE employee
router.delete('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔹 GET employee by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;