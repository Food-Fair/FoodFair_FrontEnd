import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import UserService from '../services/UserService';
import { Link } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState(''); // New state
  const [phone, setPhone] = useState(''); // New state
  const [roles, setroles] = useState('ROLE_CUSTOMER');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  const navigate = useNavigate();

  const checkAndRedirect = () => {
    const access_token = localStorage.getItem('access_token');
    
    if (!access_token) {
      return '/login';
    }
  
    try {
      const decodedToken = JSON.parse(atob(access_token.split(".")[1]));
      return decodedToken.authorities === "ROLE_OWNER" ? '/admin' : '/';
    } catch (error) {
      console.error("Error decoding token:", error);
      return '/login';
    }
  };

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email: email,
        password: password,
      });
  
      if (response.status === 200) {
                // After successful login
        localStorage.setItem('access_token', response.data.access_token);
        window.dispatchEvent(new Event('loginStatusChanged')); // Add this line
        const redirectPath = checkAndRedirect();

        const userInfo = UserService.setUserTypeFromToken();
        
        showNotification('Successfully logged in!', 'success');
        
        // Delay navigation to show the notification
        setTimeout(() => {
          navigate(redirectPath);
        }, 1000);

        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Login failed:', err);
      showNotification(err.response?.data?.message || 'Login failed. Please try again.', 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerResponse = await axios.post('http://localhost:8080/api/register', {
        email: email,
        password: password,
        roles: [roles],
      });

      if (registerResponse.status === 200 || registerResponse.status === 201) {
        const loginResponse = await axios.post('http://localhost:8080/api/login', {
          email: email,
          password: password,
        });

        if (loginResponse.status === 200) {
          const token = loginResponse.data.access_token;

          try {
            await axios.post(
              'http://localhost:8080/customer/create',
              {
                name: name,
                address: address,
                phone: phone
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            showNotification('Registration successful!', 'success');
            
            setName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setPhone('');
            setroles('ROLE_CUSTOMER');
            setIsRegister(false);

            setTimeout(() => {
              navigate('/login');
              navigate(redirectPath);
            }, 1500);
          } catch (profileError) {
            showNotification('Profile creation failed. Please try again.', 'error');
          }
        }
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="login-container transition-all duration-300 ease-in-out">
      {notification.show && (
        <div
          className={`fixed bottom-6 h-[4rem] w-[20rem] mr-[10rem] right-4 px-6 py-4 rounded-lg text-black shadow-lg 
            transform transition-all duration-500 ease-in-out 
            border-2 ${notification.type === 'success' ? 'border-orange-400' : 'border-red-500'}
            bg-white`}
        >
          <div className="flex items-center h-full">
            <span className="text-lg font-normal leading-tight">
              {notification.message}
            </span>
            <div className="h-1 bg-gray-200 absolute bottom-0 left-0 right-0 rounded-b-lg">
              <div
                className={`h-full ${notification.type === 'success' ? 'bg-orange-400' : 'bg-red-500'} 
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
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} className="login-form">
        {isRegister && (
          <>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Enter your address"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter your phone number"
                className="input-field"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-btn">
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>

      <div className="toggle-action">
      <p>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button 
          onClick={() => setIsRegister(!isRegister)} 
          className="text-custom-orange border-none bg-transparent cursor-pointer no-underline hover:text-custom-orange/80 transition-colors"
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
    </div>
  );
};

export default LoginPage;