const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Item = require("../models/item");
const sendEmail = require("../utils/sendEmail"); 


//Add Item
exports.addItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();

    // Check low stock
    if (item.quantity < item.reorderLevel) {
      await sendEmail(
        "pixelbluegfx@gmail.com",
        "Low Stock Alert",
        `The item "${item.name}" is low in stock.\nQuantity left: ${item.quantity}`
      );
    }

    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


//Get All Items
exports.getItems = async (req, res) => {
try {
 const items = await Item.find();
 res.json(items);
} catch (err) {
 res.status(500).json({ error: err.message });
}
};


//Update Item
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Check low stock after update
    if (item.quantity < item.reorderLevel) {
      await sendEmail(
        "pixelbluegfx@gmail.com",
        "Low Stock Alert",
        `The item "${item.name}" is low in stock after an update.\nQuantity left: ${item.quantity}`
      );
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Delete Item
exports.deleteItem = async (req, res) => {
try {
 await Item.findByIdAndDelete(req.params.id);
 res.json({ message: "Item deleted" });
} catch (err) {
 res.status(500).json({ error: err.message });
}
};

//Get Low Stock Items
exports.getLowStock = async (req, res) => {
try {
 const items = await Item.find({ $expr: { $lt: ["$quantity", "$reorderLevel"] } });
 res.json(items);
} catch (err) {
 res.status(500).json({ error: err.message });
}
};

//Generate Report (Summary JSON)
exports.generateReportSummary = async (req, res) => {
try {
 const totalItems = await Item.countDocuments();
 const totalValue = await Item.aggregate([
   { $group: { _id: null, total: { $sum: { $multiply: ["$unitPrice", "$quantity"] } } } }
 ]);

 res.json({
   totalItems,
   totalValue: totalValue[0]?.total || 0,
 });
} catch (err) {
 res.status(500).json({ error: err.message });
}
};

// Helper: draw a table row
function tableRow(doc, y, c1, c2, c3, c4, header = false) {
doc
 .font(header ? "Helvetica-Bold" : "Helvetica")
 .fontSize(12)
 .fillColor(header ? "#333" : "#555")
 .text(c1, 50, y, { width: 150 })
 .text(c2, 200, y, { width: 100, align: "right" })
 .text(c3, 320, y, { width: 100, align: "right" })
 .text(c4, 440, y, { width: 100, align: "right" });
}

// Generate Report PDF
exports.generateReportPDF = async (req, res) => {
  try {
    const items = await Item.find();
    const totalItems = items.length;
    const totalValue = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const profit = totalValue * 0.2;
    const lowStockCount = items.filter((i) => i.quantity < i.reorderLevel).length;

    const doc = new PDFDocument({ margin: 50 });
    const filename = "inventory-report.pdf";

    res.setHeader("Content-disposition", `inline; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    // ====== Company Logo (Centered) ======
    const logoPath = path.join(__dirname, "..", "assets", "logo.jpg");
    console.log("Logo path:", logoPath);
    console.log("Logo exists:", fs.existsSync(logoPath));

    if (fs.existsSync(logoPath)) {
      const logoWidth = 160;
      const pageWidth = doc.page.width;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.image(logoPath, logoX, 40, { width: logoWidth });
    }

    // ====== Title ======
    doc.moveDown(4);
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#2c3e50")
      .text("Inventory Report", { align: "center" });
    doc.moveDown(1);

    // ====== Divider ======
    drawLine(doc, 80);

    // ====== Overview Section ======
    doc.moveDown(1.5);
    doc.font("Helvetica").fontSize(14).fillColor("#34495e");
    doc.text(`Total Items: ${totalItems}`);
    doc.text(`Total Value: Rs. ${totalValue.toLocaleString()}`);
    doc.text(`Estimated Profit: Rs. ${profit.toLocaleString()}`);
    doc.text(`Low Stock Items: ${lowStockCount}`);
    doc.moveDown(2);

    // ====== Table Header ======
    const tableTop = doc.y + 10;
    tableHeader(doc, tableTop);

    // ====== Table Content ======
    let yPosition = tableTop + 25;
    items.forEach((item, i) => {
      const fillColor = i % 2 === 0 ? "#f8f9fa" : "#ffffff"; // alternate row color
      tableRow(
        doc,
        yPosition,
        item.name,
        `Rs. ${item.unitPrice}`,
        item.quantity.toString(),
        `Rs. ${(item.unitPrice * item.quantity).toLocaleString()}`,
        fillColor
      );
      yPosition += 22;
    });

    // ====== Footer ======
    doc.moveDown(3);
    drawLine(doc, doc.y);
    doc
      .fontSize(12)
      .fillColor("#7f8c8d")
      .text("Generated by Ceylon Furniture Inventory Management System", { align: "center" });
    doc.text(new Date().toLocaleString(), { align: "center" });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Error generating PDF", error: err.message });
  }
};

// ====== Helper: Draw Divider Line ======
function drawLine(doc, y) {
  doc
    .strokeColor("#bdc3c7")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(doc.page.width - 50, y)
    .stroke();
}

// ====== Helper: Table Header ======
function tableHeader(doc, y) {
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#ffffff")
    .rect(50, y, doc.page.width - 100, 20)
    .fill("#2c3e50");

  doc
    .fillColor("#ffffff")
    .text("Item Name", 60, y + 5)
    .text("Unit Price", 220, y + 5)
    .text("Quantity", 340, y + 5)
    .text("Value", 440, y + 5);
}

// ====== Helper: Table Row ======
function tableRow(doc, y, name, price, qty, value, bgColor) {
  doc
    .rect(50, y, doc.page.width - 100, 20)
    .fill(bgColor)
    .strokeColor("#e0e0e0")
    .lineWidth(0.5)
    .stroke();

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#2c3e50")
    .text(name, 60, y + 5)
    .text(price, 220, y + 5)
    .text(qty, 340, y + 5)
    .text(value, 440, y + 5);
}


// ➤ Get Sales Data (by category)
exports.getSalesData = async (req, res) => {
try {
 const sales = await Item.aggregate([
   {
     $group: {
       _id: "$category",
       totalSales: { $sum: { $multiply: ["$unitPrice", "$quantity"] } }
     }
   }
 ]);
 res.json(sales);
} catch (err) {
 res.status(500).json({ error: err.message });
}
};

// Background Low Stock Check
exports.checkLowStock = async () => {
const lowStockItems = await Item.find({ $expr: { $lt: ["$quantity", "$reorderLevel"] } });

if (lowStockItems.length > 0) {
 for (let item of lowStockItems) {
   await sendEmail(
     "pixelbluegfx@outlook.com", // change to your admin email
     "⚠ Low Stock Alert",
     `The item "${item.name}" is low in stock.\n\nQuantity left: ${item.quantity}`
   );
 }
}

return lowStockItems;
};