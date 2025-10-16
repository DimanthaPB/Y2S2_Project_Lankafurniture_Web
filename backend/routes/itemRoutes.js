const express = require("express");
const router = express.Router();
const itemController = require("../controller/itemController");
const Item = require("../models/item");

// ===== Alerts =====
router.get("/alerts", async (req, res) => {
  try {
    const lowStockItems = await Item.find({
      $expr: { $lt: ["$quantity", "$reorderLevel"] },
    });
    res.json(lowStockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== CRUD =====
router.post("/", itemController.addItem);
router.get("/", itemController.getItems);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

// ===== Reports =====
router.get("/low-stock", itemController.getLowStock);
router.get("/report", itemController.generateReportSummary);
router.get("/report/pdf", itemController.generateReportPDF);

// ===== Sales =====
router.get("/sales", itemController.getSalesData);

module.exports = router;
