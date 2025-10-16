const express = require("express");
const router = express.Router();
const cartController = require("../controller/CartController");
const authMiddleware = require("../middleware/authMiddleware");

// Cart routes
router.get("/", authMiddleware.protect,(req,res)=>cartController.getCart(req,res));
router.post("/add", authMiddleware.protect,(req,res)=>cartController.addToCart(req,res));
router.put("/update",authMiddleware.protect, (req,res)=>cartController.updateCartItem(req,res));
router.delete("/remove/:itemId",authMiddleware.protect, (req,res)=>cartController.removeFromCart(req,res));
router.delete("/clear",authMiddleware.protect, (req,res)=>cartController.clearCart(req,res));

module.exports = router;