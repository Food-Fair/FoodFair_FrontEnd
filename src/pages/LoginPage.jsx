import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const [roles, setroles] = useState('ROLE_CUSTOMER'); 
  const [isRegister, setIsRegister] = useState(false); 
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages

  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email: email,
        password: password,
      });
  
      if (response.status === 200) {
        const { access_token } = response.data;
  
        // Store the token in localStorage
        localStorage.setItem("access_token", access_token);
  
        // Decode JWT token safely
        const decodedToken = JSON.parse(atob(access_token.split(".")[1])); 
        console.log("Decoded Token:", decodedToken);
  
  
        setSuccess('Login successful!');
        setError(null); // Clear error message
        setEmail('');
        setPassword('');
  
        // Navigate to the dashboard
        navigate("/");
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setSuccess(null); // Clear success message
    }
  };
  

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        email: email,
        password: password,
        roles: [roles],  // Ensure it's passed as an array
      });
  
      if (response.status === 200 || response.status === 201) {
        console.log('Registration successful:', response.data);
        setSuccess('Registration successful! You can now log in.');
        setError(null);  // Clear error message
        setName('');      // Clear name field after successful registration
        setEmail('');
        setPassword('');
        setroles('ROLE_CUSTOMER');  // Reset role to default
        setIsRegister(false);  // Switch to login mode after successful registration
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSuccess(null);  // Clear success message
    }
  };
  

  return (
    <div className="login-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit} className="login-form">
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
              className="input-field"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
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
            name="password"
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
