// src/utils/websocket.js

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Initializes and connects a STOMP client.
 *
 * @param {Function} onMessageReceived - Callback to handle received messages.
 * @param {string} userId - (Optional) User ID for user-specific notifications.
 * @returns {Client} - STOMP client instance.
 */
export const initializeStompClient = (onMessageReceived, userId) => {
  const SOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080/ws-notifications'; // Vite environment variable

  const client = new Client({
    brokerURL: null, // Required to use SockJS
    connectHeaders: {
      // Include any necessary headers here
    },
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    webSocketFactory: () => {
      return new SockJS(SOCKET_URL);
    },
    onConnect: () => {
      console.log('Connected to WebSocket');

      // Subscribe to global notifications
      client.subscribe('/topic/global-notifications', (message) => {
        if (onMessageReceived) {
          onMessageReceived(message.body);
        }
      });

      // Subscribe to user-specific notifications
      if (userId) {
        client.subscribe(`/user/topic/notifications`, (message) => {
          if (onMessageReceived) {
            onMessageReceived(message.body);
          }
        });
      }
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
  });

  client.activate();

  return client;
};

/**
 * Deactivates the STOMP client.
 *
 * @param {Client} client - STOMP client instance.
 */
export const disconnectStompClient = (client) => {
  if (client && client.active) {
    client.deactivate();
    console.log('Disconnected from WebSocket');
  }
};