import { useState, useEffect } from 'react';
import { getItems } from '../../api/itemApi';
import { addToCart } from '../../api/cartApi';
import Header from '../Header';
import { toast } from 'react-hot-toast';
import CreateSingleOrder from '../CreateSingleOrder';

const ShopPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await getItems();
      setItems(response.items || response); // Handle both formats
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      setAddingToCart(prev => ({ ...prev, [itemId]: true }));
      await addToCart(itemId, 1);
      toast.success('Item added to cart!');
    } catch (err) {
      console.error('Error adding item to cart:', err);
      toast.error(err.response?.data?.error || 'Failed to add item to cart');
    } finally {
      setAddingToCart(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Shop</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or description..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            No items found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {item.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mt-2">{item.description || 'No description available'}</p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">${item.unitPrice.toFixed(2)}</span>
                    <span className={`text-sm font-medium ${item.quantity < item.reorderLevel ? 'text-red-600' : 'text-green-600'}`}>
                      {item.quantity < item.reorderLevel ? 'Low Stock' : 'In Stock'}: {item.quantity}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      disabled={addingToCart[item._id] || item.quantity === 0}
                      className={`flex-1 py-2 px-2 rounded-lg font-medium ${
                        item.quantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                      }`}
                    >
                      {addingToCart[item._id] ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </span>
                      ) : item.quantity === 0 ? (
                        'Out of Stock'
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowOrderModal(true);
                      }}
                      disabled={item.quantity === 0}
                      className={`flex-1 py-2 px-2 rounded-lg font-medium ${
                        item.quantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
                      }`}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Single Item Order Modal */}
      {showOrderModal && selectedItem && (
        <CreateSingleOrder 
          item={selectedItem}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => {
            toast.success('Order placed successfully!');
            fetchItems(); // Refresh items to update stock
          }}
        />
      )}
    </div>
  );
};

export default ShopPage;