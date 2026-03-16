import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { isAuthenticated } from '../utils/auth';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Processing: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/signin');
      } else {
        setError('Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brown-800"></div>
          <p className="mt-4 text-brown-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brown-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-brown-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-brown-800 text-white rounded-lg hover:bg-brown-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-50">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brown-900 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <svg
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-brown-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-xl sm:text-2xl font-bold text-brown-900 mb-2">No orders yet</h2>
            <p className="text-brown-600 mb-6">You haven't placed any orders yet. Start shopping!</p>
            <Link
              to="/all-products"
              className="inline-block px-6 py-3 bg-brown-800 text-white rounded-lg hover:bg-brown-900 font-semibold transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md border border-brown-200 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-brown-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-brown-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="font-bold text-brown-900">{order.orderNumber}</span>
                      <span className="text-brown-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-lg font-bold text-brown-800">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-4 sm:px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="w-14 h-14 flex-shrink-0 bg-brown-100 rounded-lg overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brown-400 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-brown-900 truncate">{item.name}</p>
                          <p className="text-xs text-brown-500">
                            ₹{item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-brown-800 flex-shrink-0">
                          ₹{item.itemTotal.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="mt-4 pt-4 border-t border-brown-100 flex flex-col sm:flex-row justify-between gap-3">
                    <div className="text-xs text-brown-500">
                      <span className="font-semibold text-brown-700">Deliver to: </span>
                      {order.shippingAddress.fullName}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </div>
                    <Link
                      to={`/order-confirmation/${order._id}`}
                      className="text-sm font-semibold text-brown-600 hover:text-brown-800 transition-colors flex-shrink-0"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
