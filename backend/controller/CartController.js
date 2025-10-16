const Cart = require("../models/Cart.js");
const Item = require("../models/item.js");

// Get cart for a user
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.item',
      select: 'name itemNo category unitPrice'
    });
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;
    
    // Validate input
    if (!itemId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid item or quantity" });
    }
    
    // Get item details
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    
    // Check if quantity is available
    if (item.quantity < quantity) {
      return res.status(400).json({ error: "Not enough stock available" });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.item.toString() === itemId
    );
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        item: itemId,
        quantity,
        price: item.unitPrice
      });
    }
    
    await cart.save();
    
    // Return updated cart with populated items
    cart = await Cart.findById(cart._id).populate({
      path: 'items.item',
      select: 'name itemNo category unitPrice'
    });
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;
    
    // Validate input
    if (!itemId || !quantity) {
      return res.status(400).json({ error: "Invalid item or quantity" });
    }
    
    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    // Find item in cart
    const cartItemIndex = cart.items.findIndex(
      item => item.item.toString() === itemId
    );
    
    if (cartItemIndex === -1) {
      return res.status(404).json({ error: "Item not in cart" });
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(cartItemIndex, 1);
    } else {
      // Check if requested quantity is available in stock
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found in inventory" });
      }
      
      if (item.quantity < quantity) {
        return res.status(400).json({ error: "Not enough stock available" });
      }
      
      // Update quantity
      cart.items[cartItemIndex].quantity = quantity;
    }
    
    await cart.save();
    
    // Return updated cart with populated items
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.item',
      select: 'name itemNo category unitPrice'
    });
    
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    // Remove item from cart
    cart.items = cart.items.filter(item => item.item.toString() !== itemId);
    
    await cart.save();
    
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    // Clear items
    cart.items = [];
    
    await cart.save();
    
    res.json({ message: "Cart cleared successfully", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};