// src/services/UserService.js

import axios from 'axios';

class UserService {
  constructor() {
    this.baseURL = 'http://localhost:8080';
  }

  // Function to decode JWT token
  decodeToken(token) {
    try {
      // Split the token and get the payload part (second part)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Decode the base64 string
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Function to set user type based on token
  setUserTypeFromToken() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.warn('No token found in localStorage');
        return null;
      }

      const decodedToken = this.decodeToken(token);
      if (!decodedToken) {
        console.warn('Could not decode token');
        return null;
      }

      console.log('Decoded token:', decodedToken); // Debug log

      // Set user type based on authorities
      const userType = decodedToken.authorities === 'ROLE_OWNER' ? 'admin' : 'customer';
      localStorage.setItem('user_type', userType);
      
      // Also store userId for future use
      localStorage.setItem('user_id', decodedToken.userId);

      return {
        userType,
        userId: decodedToken.userId,
        email: decodedToken.sub
      };
    } catch (error) {
      console.error('Error setting user type:', error);
      return null;
    }
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

  // Utility function to get current user type
  getCurrentUserType() {
    return localStorage.getItem('user_type');
  }

  // Utility function to get current user ID
  getCurrentUserId() {
    return localStorage.getItem('user_id');
  }

  // Function to clear user data on logout
  clearUserData() {
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    // You might want to keep this in your logout handler
    localStorage.removeItem('access_token');
  }
}

export default new UserService();