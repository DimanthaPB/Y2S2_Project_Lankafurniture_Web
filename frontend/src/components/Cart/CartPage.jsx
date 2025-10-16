import { useState, useEffect } from "react";
import { getCart, updateCartItem, removeFromCart, clearCart } from "../../api/cartApi";
import { createOrder } from "../../api/orderApi";
import Header from "../Header";
import { toast } from "react-hot-toast";

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [orderFormVisible, setOrderFormVisible] = useState(false);
  const [orderData, setOrderData] = useState({
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    paymentMethod: "credit_card"
  });
  const [errors, setErrors] = useState({});
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load your cart");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    try {
      await updateCartItem(itemId, quantity);
      fetchCart();
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(error.response?.data?.error || "Failed to update cart");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
        fetchCart();
        toast.success("Cart cleared");
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setOrderData({
        ...orderData,
        [parent]: {
          ...orderData[parent],
          [child]: value
        }
      });
    } else {
      setOrderData({
        ...orderData,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Street validation
    if (!orderData.address.street.trim()) {
      newErrors["address.street"] = "Street is required";
    }
    
    // City validation
    if (!orderData.address.city.trim()) {
      newErrors["address.city"] = "City is required";
    } else if (!/^[a-zA-Z\s]+$/.test(orderData.address.city)) {
      newErrors["address.city"] = "City should contain only letters";
    }
    
    // State validation
    if (!orderData.address.state.trim()) {
      newErrors["address.state"] = "State is required";
    } else if (!/^[a-zA-Z\s]+$/.test(orderData.address.state)) {
      newErrors["address.state"] = "State should contain only letters";
    }
    
    // Zip code validation
    if (!orderData.address.zipCode.trim()) {
      newErrors["address.zipCode"] = "Zip code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(orderData.address.zipCode)) {
      newErrors["address.zipCode"] = "Invalid zip code format (e.g., 12345 or 12345-6789)";
    }
    
    // Country validation
    if (!orderData.address.country.trim()) {
      newErrors["address.country"] = "Country is required";
    } else if (!/^[a-zA-Z\s]+$/.test(orderData.address.country)) {
      newErrors["address.country"] = "Country should contain only letters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    try {
      setProcessingOrder(true);
      await createOrder(orderData);
      toast.success("Order placed successfully!");
      setOrderFormVisible(false);
      fetchCart(); // Refresh cart (should be empty after order creation)
      setOrderData({
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        },
        paymentMethod: "creditCard"
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.error || "Failed to create order");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <a href="/shop" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.item.name}</div>
                            <div className="text-sm text-gray-500">{item.item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.item._id, item.quantity - 1)}
                            className="bg-gray-200 px-2 py-1 rounded-l"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.item._id, item.quantity + 1)}
                            className="bg-gray-200 px-2 py-1 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${(item.item.unitPrice * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-900"
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    Total: ${cart.totalAmount.toFixed(2)}
                  </p>
                  <button
                    onClick={() => setOrderFormVisible(true)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {orderFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
              
              <form onSubmit={handleCreateOrder}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={orderData.address.street}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors["address.street"] ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors["address.street"] && (
                    <p className="text-red-500 text-xs mt-1">{errors["address.street"]}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={orderData.address.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors["address.city"] ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors["address.city"] && (
                    <p className="text-red-500 text-xs mt-1">{errors["address.city"]}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={orderData.address.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors["address.state"] ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors["address.state"] && (
                    <p className="text-red-500 text-xs mt-1">{errors["address.state"]}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={orderData.address.zipCode}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors["address.zipCode"] ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors["address.zipCode"] && (
                    <p className="text-red-500 text-xs mt-1">{errors["address.zipCode"]}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={orderData.address.country}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors["address.country"] ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors["address.country"] && (
                    <p className="text-red-500 text-xs mt-1">{errors["address.country"]}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={orderData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="credit_card">Credit Card</option>

                    <option value="paypal">PayPal</option>
                    <option value="bankTransfer">Bank Transfer</option>
                  </select>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setOrderFormVisible(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingOrder}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {processingOrder ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;