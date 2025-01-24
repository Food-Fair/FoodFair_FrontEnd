import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email: email,
        password: password,
      });
  
      if (response.status === 200) {
        localStorage.setItem('access_token', response.data.access_token);
        const redirectPath = checkAndRedirect();
        navigate(redirectPath);
  
        setSuccess('Login successful!');
        setError(null);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setSuccess(null);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, register the user
      const registerResponse = await axios.post('http://localhost:8080/api/register', {
        email: email,
        password: password,
        roles: [roles],
      });

      if (registerResponse.status === 200 || registerResponse.status === 201) {
        // After successful registration, login to get the token
        const loginResponse = await axios.post('http://localhost:8080/api/login', {
          email: email,
          password: password,
        });

        if (loginResponse.status === 200) {
          const token = loginResponse.data.access_token;
          localStorage.setItem('access_token', token);

          // Create customer profile
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

            setSuccess('Registration and profile creation successful!');
            setError(null);
            setName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setPhone('');
            setroles('ROLE_CUSTOMER');
            setIsRegister(false);

            // Redirect after successful registration
            const redirectPath = checkAndRedirect();
            navigate(redirectPath);
          } catch (profileError) {
            console.error('Profile creation failed:', profileError);
            setError('Profile creation failed. Please try again.');
          }
        }
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="login-container">
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
          <button onClick={() => setIsRegister(!isRegister)} className="toggle-btn">
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;