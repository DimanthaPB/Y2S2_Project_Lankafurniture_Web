const express = require("express");
const router = express.Router();
const orderController = require("../controller/OrderController");
const authMiddleware = require("../middleware/authMiddleware");



// User routes
router.post("/", authMiddleware.protect, orderController.createOrder);
router.post("/single-item", authMiddleware.protect, orderController.createSingleItemOrder);
router.get("/", authMiddleware.protect, orderController.getUserOrders);
router.get("/:id", authMiddleware.protect, orderController.getOrderById);
router.put("/:id/cancel", authMiddleware.protect, orderController.cancelOrder);
router.delete("/:id", authMiddleware.protect, orderController.deleteOrder);

// Admin routes
router.get("/admin/all",  orderController.getAllOrders);
router.put("/admin/:id/status",  orderController.updateOrderStatus);

module.exports = router;