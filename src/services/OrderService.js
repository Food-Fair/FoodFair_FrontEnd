// src/services/OrderService.js

import axios from 'axios';

class OrderService {
  constructor() {
    this.baseURL = 'http://localhost:8080';
  }

  // Helper method to get auth header
  getAuthHeader() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Get orders by status for admin
  async getOrdersByStatus(status, sortByDateTime = true) {
    try {
      console.log(`Fetching orders with status: ${status}`);
      
      const response = await axios.get(
        `${this.baseURL}/admin/orders-by-status`,
        {
          params: {
            status: status,
            sortByDateTime: sortByDateTime
          },
          headers: this.getAuthHeader(),
          withCredentials: true
        }
      );

      console.log('Orders received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, newStatus) {
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      
      const response = await axios.put(
        `${this.baseURL}/admin/updateOrderStatus`,
        null,
        {
          params: {
            orderId: orderId,
            status: newStatus
          },
          headers: this.getAuthHeader(),
          withCredentials: true
        }
      );

      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Get customer orders
  async getCustomerOrders(status, sortBy = null) {
    try {
      console.log(`Fetching customer orders with status: ${status}`);
      
      const response = await axios.get(
        `${this.baseURL}/customer/get-orders`,
        {
          params: {
            orderStatus: status,
            sortBy: sortBy
          },
          headers: this.getAuthHeader(),
          withCredentials: true
        }
      );

      console.log('Customer orders received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }

  // Create new order
  async createOrder(orderData) {
    try {
      console.log('Creating new order:', orderData);
      
      const response = await axios.post(
        `${this.baseURL}/customer/createOrder`,
        orderData,
        {
          headers: this.getAuthHeader(),
          withCredentials: true
        }
      );

      console.log('Order created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Helper method to get orders by multiple statuses
  async getOrdersByMultipleStatuses(statuses) {
    try {
      const orderPromises = statuses.map(status => 
        this.getOrdersByStatus(status)
      );
      
      const ordersArrays = await Promise.all(orderPromises);
      return ordersArrays.flat();
    } catch (error) {
      console.error('Error fetching orders for multiple statuses:', error);
      throw error;
    }
  }
}

// Create enum for order statuses
export const OrderStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  ON_PROGRESS: 'ON_PROGRESS',
  DELIVERED: 'DELIVERED'
};

export default new OrderService();