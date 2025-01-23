import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodDetails, setFoodDetails] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFoodDetails = async (foodId) => {
    // If we already have the food details, don't fetch again
    if (foodDetails[foodId]) {
      return foodDetails[foodId];
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/foods/${foodId}`,
      );
      
      // Store the food details in state
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

  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:8080/admin/orders-by-status',
        {
          params: {
            status: 'PENDING',
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
      
      // Fetch food details for all orders
      response.data.forEach(order => {
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="orders-container">
      <h2>Pending Orders</h2>
      {orders.length === 0 ? (
        <p>No pending orders found</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <div className="order-title">
                  <h3>Order #{index + 1}</h3>
                  {order.orderItems.map((item, itemIndex) => (
                    <span key={itemIndex} className="food-name">
                      {foodDetails[item.foodId]?.name || 'Loading...'}
                      {itemIndex < order.orderItems.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <span className={`status ${order.orderStatus.toLowerCase()}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div className="order-items">
                <h4>Order Items:</h4>
                {order.orderItems.map((item, itemIndex) => (
                  <div key={itemIndex} className="item-details">
                    <p><strong>Item:</strong> {foodDetails[item.foodId]?.name || 'Loading...'}</p>
                    <p><strong>Description:</strong> {foodDetails[item.foodId]?.description || 'Loading...'}</p>
                    <p><strong>Flavor:</strong> {item.flavorName}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Weight:</strong> {item.weight}kg</p>
                    <p><strong>Price per item:</strong> Rs.{item.flavorPrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <p><strong>Delivery Time:</strong> {formatDateTime(order.deliveryTime)}</p>
                <p><strong>Special Requirements:</strong> {order.specialRequirements || 'None'}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Delivery Charge:</strong> Rs.{order.deliveryCharge.toFixed(2)}</p>
                <p><strong>Total Price:</strong> Rs.{order.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Updated styles to include new food name styling
const styles = `
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
    align-items: flex-start;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .order-title {
    flex: 1;
  }

  .order-title h3 {
    margin: 0 0 5px 0;
  }

  .food-name {
    font-size: 0.9em;
    color: #666;
    font-style: italic;
    display: inline-block;
  }

  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: bold;
    margin-left: 10px;
  }

  .status.pending {
    background-color: #fff3cd;
    color: #856404;
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

  .order-details {
    font-size: 0.9em;
  }

  .order-details p {
    margin: 8px 0;
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
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default OrderPage;