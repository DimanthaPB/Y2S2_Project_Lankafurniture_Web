import React, { useState } from 'react';
import { createSingleItemOrder } from '../api/orderApi';
import { toast } from 'react-hot-toast';

const CreateSingleOrder = ({ item, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    paymentMethod: 'cash'
  });

  // Regex patterns for validation
  const patterns = {
    city: /^[A-Za-z\s]+$/,
    state: /^[A-Za-z\s]+$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    country: /^[A-Za-z\s]+$/
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });

      // Validate address fields
      if (patterns[child]) {
        if (!patterns[child].test(value) && value !== '') {
          setErrors({
            ...errors,
            [child]: `Invalid ${child} format`
          });
        } else {
          const newErrors = { ...errors };
          delete newErrors[child];
          setErrors(newErrors);
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check required fields
    if (!formData.address.street) newErrors.street = 'Street is required';
    if (!formData.address.city) newErrors.city = 'City is required';
    if (!formData.address.state) newErrors.state = 'State is required';
    if (!formData.address.zipCode) newErrors.zipCode = 'Zip code is required';
    if (!formData.address.country) newErrors.country = 'Country is required';
    
    // Validate patterns
    if (formData.address.city && !patterns.city.test(formData.address.city)) {
      newErrors.city = 'City should contain only letters';
    }
    if (formData.address.state && !patterns.state.test(formData.address.state)) {
      newErrors.state = 'State should contain only letters';
    }
    if (formData.address.zipCode && !patterns.zipCode.test(formData.address.zipCode)) {
      newErrors.zipCode = 'Invalid zip code format (e.g., 12345 or 12345-6789)';
    }
    if (formData.address.country && !patterns.country.test(formData.address.country)) {
      newErrors.country = 'Country should contain only letters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const orderData = {
        itemId: item._id,
        quantity: formData.quantity,
        address: formData.address,
        paymentMethod: formData.paymentMethod
      };
      
      await createSingleItemOrder(orderData);
      toast.success('Order placed successfully!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order {item.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-4 p-3 border rounded-lg">
          <div className="flex items-center">
            <img 
              src={item.image || 'https://via.placeholder.com/100'} 
              alt={item.name} 
              className="w-16 h-16 object-cover rounded mr-3"
            />
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">${item.unitPrice?.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Available: {item.stock}</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max={item.stock}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            
            <div className="mb-2">
              <label className="block text-gray-700 mb-1">Street</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
            </div>
            
            <div className="mb-2">
              <label className="block text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Zip Code</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="cash">Cash on Delivery</option>
              <option value="credit">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSingleOrder;