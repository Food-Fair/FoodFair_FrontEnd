// src/components/Notifications.jsx

import React, { useState, useEffect } from 'react';
import { initializeStompClient, disconnectStompClient } from '@/utils/websocket';
import { FiBell } from 'react-icons/fi'; // Using react-icons for the bell icon


const Notifications = () => { // Removed userId as prop; will fetch internally
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold the extracted userId

  useEffect(() => {
    // Fetch the token from localStorage
    const token = localStorage.getItem('access_token');

    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded && decoded.userId) { // Adjust 'userId' based on your JWT structure
        setUserId(decoded.userId);
      } else {
        console.warn('userId not found in token.');
      }
    } else {
      console.warn('No access_token found in localStorage.');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // Initialize and connect the STOMP client with the userId
      const client = initializeStompClient((notification) => {
        setNotifications((prevNotifications) => [notification, ...prevNotifications]);
      }, userId);

      setStompClient(client);

      // Cleanup on component unmount
      return () => {
        disconnectStompClient(client);
      };
    }
  }, [userId]);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button onClick={toggleNotifications} className="relative">
        <FiBell size={24} className="text-gray-600 hover:text-[#de7f45] cursor-pointer" />
        {notifications.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-30">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="p-4 text-gray-500">No notifications</li>
            )}
            {notifications.map((notification, index) => (
              <li key={index} className="p-4 border-t border-gray-200">
                {notification}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;