import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserService from '../services/UserService';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodDetails, setFoodDetails] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const OrderStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    ON_PROGRESS: 'ON_PROGRESS',
    DELIVERED: 'DELIVERED'
  };


  const [selectedStatus, setSelectedStatus] = useState("PENDING");

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };


  const [userDetails, setUserDetails] = useState({});

  // Add this function to fetch user details
  const fetchUserDetails = async (userId) => {
    try {
      const customerData = await UserService.getCustomerDetails(userId);
      setUserDetails(prev => ({
        ...prev,
        [userId]: customerData
      }));

      console.log('received customer data', customerData); // Debug log
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleFoodDetails = async (foodId) => {
    if (foodDetails[foodId]) {
      return foodDetails[foodId];
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/foods/${foodId}`,
      );
      
      setFoodDetails(prev => ({
        ...prev,
        [foodId]: response.data
      }));
      
      return response.data;
    } catch (err) {
      console.error(`Failed to load food details for ID: ${foodId}`, err);
      return null;
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    console.log('Updating order:', { orderId, newStatus }); // Debug log
    setUpdatingStatus(true);
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      showNotification('No authentication token found', 'error');
      setUpdatingStatus(false);
      return;
    }
  
    try {
      const response = await axios({
        method: 'put',
        url: 'http://localhost:8080/admin/updateOrderStatus',
        params: {
          orderId: orderId,
          status: newStatus
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
  
      console.log('Update response:', response.data); // Debug log
  
      if (response.status === 200) {
      setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, orderStatus: newStatus }
            : order
      ));
      showNotification(`Order status updated to ${newStatus}`, 'success');
      }
    } catch (error) {
      console.error('Error updating status:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 403) {
        showNotification('You do not have permission to update order status', 'error');
      } else {
      showNotification(
        error.response?.data || 'Failed to update order status',
        'error'
      );
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    console.log('Orders data:', orders); // Debug log
  }, [orders]);

  // Modify your existing fetchOrders function
  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost:8080/admin/orders-by-status',
        {
          params: {
            status: selectedStatus,
            sortByDateTime: true
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
  
      setOrders(response.data);
      
      // Fetch user details for each order
      response.data.forEach(order => {
        if (order.userId) {
          fetchUserDetails(order.userId);
        }
        order.orderItems.forEach(item => {
          handleFoodDetails(item.foodId);
        });
      });
  
    } catch (err) {
      setError(err.response?.data || 'An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString();
  };

  const StatusFilter = ({ selectedStatus, onStatusChange }) => (
    <div className="status-filter-container mb-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-semibold text-lg">Order Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="min-w-[200px] px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm 
                      text-gray-700 font-medium
                      focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                      transition-colors duration-200"
          >
            {Object.entries(OrderStatus).map(([key, value]) => (
              <option key={key} value={value} className="py-2">
                {value.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${selectedStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
              selectedStatus === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
              selectedStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
              selectedStatus === 'ON_PROGRESS' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'}`}>
            {selectedStatus.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="orders-container">
      <style>
        {`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>

      {notification.show && (
        <div
          className={`fixed bottom-6 h-[4rem] w-[20rem] mr-[10rem] right-4 px-6 py-4 rounded-lg text-black shadow-lg 
            transform transition-all duration-500 ease-in-out 
            border-2 ${notification.type === 'success' ? 'border-orange-500' : 'border-red-500'}
            bg-white`}
        >
          <div className="flex items-center h-full">
            <span className="text-lg font-normal leading-tight">
              {notification.message}
            </span>
            <div className="h-1 bg-gray-200 absolute bottom-0 left-0 right-0 rounded-b-lg">
              <div
                className={`h-full ${notification.type === 'success' ? 'bg-orange-500' : 'bg-red-500'} 
                  transition-all duration-3000 ease-linear rounded-b-lg`}
                style={{
                  width: '100%',
                  animation: 'shrink 3s linear forwards'
                }}
              />
            </div>
          </div>
        </div>
      )}

<h2 className="text-2xl font-bold mb-6">Orders Management</h2>
{/* Add Status Filter */}
<StatusFilter 
      selectedStatus={selectedStatus} 
      onStatusChange={(status) => setSelectedStatus(status)} 
    />
      {orders.length === 0 ? (
      <p className="text-gray-500 text-center">No orders found for status: {selectedStatus}</p>
    ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-title">
                <div className="flex  gap-4">
  <h3 className="text-xl font-bold">Order_id</h3>
  <small className="text-gray-500">ID: {order.id}</small>
</div>

                  
                  {/* Add user details section */}
                  {userDetails[order.userId] && (
                <div className="customer-details mt-2">
                  <p className="text-sm">
                    <span className="font-semibold">Customer:</span> {userDetails[order.userId].name}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Location:</span> {userDetails[order.userId].address}
                  </p>
                </div>
              )}
                              </div>
            <div className="flex items-center gap-4">
              <span className={`status ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
              <select
                value={order.orderStatus}
                onChange={(e) => {
                  console.log('Selected order for update:', {
                    id: order.id,
                    newStatus: e.target.value,
                    currentStatus: order.orderStatus
                  });
                  handleStatusUpdate(order.id, e.target.value);
                }}
                disabled={updatingStatus}
                className="border rounded-md px-3 py-1.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="PENDING">PENDING</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="REJECTED">REJECTED</option>
                <option value="ON_PROGRESS">ON PROGRESS</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </div>
          </div>

          <div className="order-items">
  <h4 className="text-lg font-bold mb-3">Order Items:</h4>
  {order.orderItems.map((item, itemIndex) => (
    <div key={itemIndex} className="item-details">
      <div className="flex gap-4">
        <div className="food-image-container">
          <img
            src={foodDetails[item.foodId]?.images && foodDetails[item.foodId]?.images.length > 0
              ? `http://localhost:8080/foods/image/${foodDetails[item.foodId].images[0]}`
              : "/placeholder-image.jpg"}
            alt={foodDetails[item.foodId]?.name || 'Food item'}
            className="food-image"
          />
        </div>
                    <div className="food-details">
                      <p><strong>Item:</strong> {foodDetails[item.foodId]?.name || 'Loading...'}</p>
                      <p><strong>Flavor:</strong> {item.flavorName}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Weight:</strong> {item.weight} pound</p>
                      <p><strong>Price per item:</strong> {item.flavorPrice.toFixed(2)} Tk</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

              <div className="order-details">
                <p><strong>Delivery Time:</strong> {formatDateTime(order.deliveryTime)}</p>
                <p><strong>Special Requirements:</strong> {order.specialRequirements || 'None'}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Delivery Charge:</strong> {order.deliveryCharge.toFixed(2)} Tk</p>
                <p><strong>Total Price:</strong> {order.price.toFixed(2)} Tk</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = `

  /* Updated styles */
.status-filter-container {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f9fafb;
  padding: 1rem 0;
}

.status-filter-container select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.status-filter-container select:hover {
  border-color: #f97316;
}

.status-filter-container select option {
  padding: 0.5rem;
}

/* Status badge styles */
.status-badge {
  transition: color 0.3s ease, background-color 0.3s ease;
}
  .orders-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .orders-list {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  .order-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .order-title {
    flex: 1;
  }

  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: bold;
    margin-right: 10px;
  }

  .status.pending {
    background-color: #fff3cd;
    color: #856404;
  }

  .status.accepted {
    background-color: #d1fae5;
    color: #065f46;
  }

  .status.rejected {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .status.on_progress {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .status.delivered {
    background-color: #d1fae5;
    color: #065f46;
  }

  .order-items {
    margin-bottom: 15px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }

  .item-details {
    padding: 10px;
    margin: 5px 0;
    border-bottom: 1px solid #eee;
  }

  .item-details p {
    margin: 5px 0;
  }

  .orders-list {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); /* Increased from 350px to 450px */
  }

  .order-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    width: 100%;
  }

  .item-details {
    padding: 15px;
    margin: 10px 0;
    border-bottom: 1px solid #eee;
    background-color: white;
    border-radius: 8px;
  }

  .food-image-container {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #eee;
  }

  .food-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .food-details {
    flex: 1;
  }

  .food-details p {
    margin: 6px 0;
    line-height: 1.4;
  }

  /* Add hover effect to the image */
  .food-image-container:hover .food-image {
    transform: scale(1.05);
    transition: transform 0.3s ease;
  }

  /* Make the layout more responsive */
  @media (max-width: 640px) {
    .orders-list {
      grid-template-columns: 1fr;
    }

    .item-details .flex {
      flex-direction: column;
    }

    .food-image-container {
      width: 100%;
      height: 200px;
      margin-bottom: 15px;
    }

  .loading {
    text-align: center;
    padding: 20px;
    font-size: 1.2em;
  }

  .error {
    color: #721c24;
    background-color: #f8d7da;
    padding: 10px;
    border-radius: 4px;
    margin: 20px;
    text-align: center;
  }

  select {
    background-color: white;
    border-color: #e5e7eb;
    cursor: pointer;
    transition: all 0.2s;
  }

  select:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  select:hover:not(:disabled) {
    border-color: #9ca3af;
  }

  select:focus {
    outline: none;
    border-color: #6366f1;
    ring: 2px solid #e0e7ff;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default OrderPage;