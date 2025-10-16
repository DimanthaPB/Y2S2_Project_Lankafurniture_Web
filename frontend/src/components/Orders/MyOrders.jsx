import { useState, useEffect } from 'react';
import { getUserOrders, deleteOrder, updateOrderStatus } from '../../api/orderApi';
import Header from '../Header';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      // Filter only pending orders
      const pendingOrders = data
      setOrders(pendingOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditFormData({
        ...editFormData,
        [parent]: {
          ...editFormData[parent],
          [child]: value
        }
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value
      });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Street validation
    if (!editFormData.address.street.trim()) {
      newErrors['address.street'] = 'Street is required';
    }
    
    // City validation
    if (!editFormData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    } else if (!/^[a-zA-Z\s]+$/.test(editFormData.address.city)) {
      newErrors['address.city'] = 'City should contain only letters';
    }
    
    // State validation
    if (!editFormData.address.state.trim()) {
      newErrors['address.state'] = 'State is required';
    } else if (!/^[a-zA-Z\s]+$/.test(editFormData.address.state)) {
      newErrors['address.state'] = 'State should contain only letters';
    }
    
    // Zip code validation
    if (!editFormData.address.zipCode.trim()) {
      newErrors['address.zipCode'] = 'Zip code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(editFormData.address.zipCode)) {
      newErrors['address.zipCode'] = 'Invalid zip code format (e.g., 12345 or 12345-6789)';
    }
    
    // Country validation
    if (!editFormData.address.country.trim()) {
      newErrors['address.country'] = 'Country is required';
    } else if (!/^[a-zA-Z\s]+$/.test(editFormData.address.country)) {
      newErrors['address.country'] = 'Country should contain only letters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Since there's no direct update order API, we'll use updateOrderStatus
      // and pass the updated address and payment method
      await updateOrderStatus(selectedOrder._id, 'pending', {
        address: editFormData.address,
        paymentMethod: editFormData.paymentMethod
      });
      
      toast.success('Order updated successfully');
      setEditModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.error || 'Failed to update order');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(selectedOrder._id);
      toast.success('Order deleted successfully');
      setDeleteModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error(error.response?.data?.error || 'Failed to delete order');
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
        <h1 className="text-3xl font-bold mb-8 text-center">My Pending Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">You don't have any pending orders</p>
            <a href="/shop" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Order #{order.orderNumber}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Items</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {order.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${item.subtotal.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                      <p className="text-sm text-gray-600">{order.address.street}</p>
                      <p className="text-sm text-gray-600">{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                      <p className="text-sm text-gray-600">{order.address.country}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                      <p className="text-sm text-gray-600">Method: {order.paymentMethod}</p>
                      <p className="text-sm text-gray-600">Total: ${order.totalBill.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                   
              { order.status.toUpperCase()==="PENDING"&&     <button
                      onClick={() => handleDeleteClick(order)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete Order
                    </button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Edit Modal */}
        {editModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
              
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={editFormData.address.street}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors['address.street'] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors['address.street'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['address.street']}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={editFormData.address.city}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors['address.city'] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors['address.city'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['address.city']}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={editFormData.address.state}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors['address.state'] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors['address.state'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['address.state']}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={editFormData.address.zipCode}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors['address.zipCode'] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors['address.zipCode'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['address.zipCode']}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={editFormData.address.country}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${errors['address.country'] ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors['address.country'] && (
                    <p className="text-red-500 text-xs mt-1">{errors['address.country']}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={editFormData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                
                    <option value="cash_on_delivery">Cash On Delivery</option>
                    <option value="bankTransfer">Bank Transfer</option>
                  </select>
                </div>
                
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {deleteModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-6">Are you sure you want to delete order #{selectedOrder.orderNumber}? This action cannot be undone.</p>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;