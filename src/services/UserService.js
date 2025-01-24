// src/services/UserService.js

import axios from 'axios';

class UserService {
  constructor() {
    this.baseURL = 'http://localhost:8080';
  }

  async getCustomerDetails(userId) {
    try {

      const response = await axios.get(
        `${this.baseURL}/api/customer/${userId}`,
      );

      console.log('Customer details response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error in getCustomerDetails:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
}

export default new UserService();