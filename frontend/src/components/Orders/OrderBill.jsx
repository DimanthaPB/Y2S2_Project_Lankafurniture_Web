import React from 'react';
import logo from '../../assets/logo.jpg';

const lkrFormat = new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 2 });

const OrderBill = React.forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className="p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <img src={logo} alt="Lanka Furniture Logo" className="w-20 h-20 object-contain mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Lanka Furniture Pvt Ltd</h1>
            <p className="text-gray-600">Malabe, Sri Lanka</p>
            <p className="text-gray-600">lankafurniture@gmail.com</p>
            <p className="text-gray-600">0117506783</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
          <p className="text-gray-600">Order #{order.orderNumber}</p>
          <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-8">
        <h3 className="text-gray-800 font-bold mb-2">Bill To:</h3>
        <div className="text-gray-600">
          <p>{order.address.street}</p>
          <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
          <p>{order.address.country}</p>
        </div>
      </div>

      {/* Order Items */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Item</th>
            <th className="py-2 px-4 text-right">Price</th>
            <th className="py-2 px-4 text-right">Quantity</th>
            <th className="py-2 px-4 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">{item.name}</td>
              <td className="py-2 px-4 text-right">{lkrFormat.format(item.price)}</td>
              <td className="py-2 px-4 text-right">{item.quantity}</td>
              <td className="py-2 px-4 text-right">{lkrFormat.format(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Total:</span>
            <span>{lkrFormat.format(order.totalBill)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-bold">Payment Method:</span>
            <span>{order.paymentMethod}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>Thank you for your business!</p>
        <p>For any inquiries, please contact us at 0117506783 or lankafurniture@gmail.com</p>
      </div>
    </div>
  );
});

OrderBill.displayName = 'OrderBill';

export default OrderBill;