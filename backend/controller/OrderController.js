const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Item = require("../models/item");
const mongoose = require("mongoose");

const generateOrderNumber=()=>{
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000); 
    
   return`ORD-${year}${month}${day}-${random}`;
}

// Create a single item order directly
exports.createSingleItemOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity, address, paymentMethod } = req.body;

    // Validate required fields
    if (!itemId || !quantity || !address || !paymentMethod) {
      return res.status(400).json({ error: "Item ID, quantity, address, and payment method are required" });
    }

    // Check if item exists and has enough stock
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (item.quantity < quantity) {
      return res.status(400).json({ 
        error: `Not enough stock for ${item.name}. Available: ${item.quantity}, Requested: ${quantity}` 
      });
    }

    // Create order with single item
    const orderItem = {
      item: item._id,
      name: item.name,
      quantity: quantity,
      price: item.unitPrice,
      subtotal: item.unitPrice * quantity
    };

    const totalBill = orderItem.subtotal;

    // Create new order
    const order = new Order({
      user: userId,
      items: [orderItem],
      totalBill,
      address,
      paymentMethod,
      orderNumber: generateOrderNumber()
    });

    // Save order
    await order.save();

    // Update item stock
    item.quantity -= quantity;
    await item.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error("Error creating single item order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Create a new order from cart
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, paymentMethod } = req.body;

    // Validate required fields
    if (!address || !paymentMethod) {
      return res.status(400).json({ error: "Address and payment method are required" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.item');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check if all items are in stock
    for (const cartItem of cart.items) {
      const item = await Item.findById(cartItem.item._id);
      if (!item) {
        return res.status(404).json({ error: `Item ${cartItem.item.name} not found` });
      }
      if (item.quantity < cartItem.quantity) {
        return res.status(400).json({ 
          error: `Not enough stock for ${item.name}. Available: ${item.quantity}, Requested: ${cartItem.quantity}` 
        });
      }
    }

    // Create order items from cart items
    const orderItems = cart.items.map(cartItem => ({
      item: cartItem.item._id,
      name: cartItem.item.name,
      quantity: cartItem.quantity,
      price: cartItem.price,
      subtotal: cartItem.price * cartItem.quantity
    }));

    // Calculate total bill
    const totalBill = orderItems.reduce((total, item) => total + item.subtotal, 0);

    // Create new order
    const order = new Order({
        orderNumber:generateOrderNumber(),
      user: userId,
      items: orderItems,
      totalBill,
      address,
      paymentMethod,
      status: 'pending'
    });

    await order.save();

    // Update inventory (reduce quantities)
    for (const orderItem of order.items) {
      await Item.findByIdAndUpdate(
        orderItem.item,
        { $inc: { quantity: -orderItem.quantity } }
      );
    }

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ 
      user: userId,
      isDeleted: false 
    }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific order by ID
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findOne({ 
      _id: orderId,
      user: userId,
      isDeleted: false 
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findOne({ 
      _id: orderId,
      user: userId,
      isDeleted: false 
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Only allow cancellation if order is pending or processing
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ 
        error: "Cannot cancel order that has been shipped or delivered" 
      });
    }
    
    // Update order status
    order.status = 'cancelled';
    await order.save();
    
    // Return items to inventory
    for (const orderItem of order.items) {
      await Item.findByIdAndUpdate(
        orderItem.item,
        { $inc: { quantity: orderItem.quantity } }
      );
    }
    
    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    
    const order = await Order.findOne({ 
      _id: orderId,
      user: userId,
      isDeleted: false 
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Soft delete
    order.isDeleted = true;
    await order.save();
    
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
  
    
    const { status } = req.query;
    const filter = { isDeleted: false };
    
    // Filter by status if provided
    if (status) {
      filter.status = status;
    }
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
   
    
    const { status } = req.body;
    const orderId = req.params.id;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    
    const order = await Order.findOne({ 
      _id: orderId,
      isDeleted: false 
    });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Update status
    order.status = status;
    await order.save();
    
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};