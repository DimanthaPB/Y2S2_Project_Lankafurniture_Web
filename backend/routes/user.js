const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");


// 🔐 Get all users (admin only)
router.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// 🆕 Create user (admin-side)
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed, role });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✏️ Update user (admin-side)
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const updated = await User.findByIdAndUpdate(req.params.id, { name, email, role }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

// ❌ Delete user (admin-side)
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// 📄 Generate PDF report
router.get("/users/report", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 30 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=User_Report.pdf");
    doc.pipe(res);

    // 🔸 Header with logo and company info
    const logoPath = path.resolve("assets/logo.jpg");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 30, 20, { width: 50 });
    }

    doc
      .fontSize(18)
      .text("LankaFurniture Pvt Ltd", 100, 20)
      .fontSize(9)
      .text("215/1, New Kandy Road, Malabe, Sri Lanka", 100, 40)
      .text("Phone: +94703914047 | Email: hr@lankafurniture.com", 100, 55);

    doc.moveDown().fontSize(14).text("User Report", { align: "center", underline: true });
    doc.moveDown().fontSize(11).text(`Total Users: ${users.length}`, { align: "center" });
    doc.moveDown();

    // 🔸 Table layout
    const tableTop = doc.y + 10;
    const rowHeight = 20;
    const colWidths = [120, 200, 50, 70];
    const colX = [30];
    for (let i = 0; i < colWidths.length - 1; i++) {
      colX.push(colX[i] + colWidths[i]);
    }

    const headers = ["Name", "Email", "Role", "Created Date"];
    headers.forEach((header, i) => {
      doc
        .rect(colX[i], tableTop, colWidths[i], rowHeight)
        .fillAndStroke("#f3f4f6", "#cccccc")
        .fillColor("#000")
        .fontSize(9)
        .text(header, colX[i] + 4, tableTop + 6, { width: colWidths[i] - 8 });
    });

    // 🔸 Draw table rows
    let y = tableTop + rowHeight;
    users.forEach(user => {
      const row = [
        user.name,
        user.email,
        user.role,
        user.createdAt.toLocaleDateString()
      ];

      row.forEach((val, i) => {
        doc
          .rect(colX[i], y, colWidths[i], rowHeight)
          .stroke()
          .fillColor("#000")
          .fontSize(8)
          .text(val || "-", colX[i] + 4, y + 6, { width: colWidths[i] - 8 });
      });

      y += rowHeight;

      // 🔸 Page break if needed
      if (y > doc.page.height - 40) {
        doc.addPage({ layout: "landscape" });
        y = 30;
      }
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Failed to generate report", error: err.message });
  }
});


module.exports = router;