import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('ROLE_CUSTOMER'); // Default role
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log('Registering user:', email, password, roles);
    try {
      // Make a POST request to the backend register endpoint
      const response = await axios.post('http://localhost:8080/api/register', {
        email: email,
        password: password,
        roles: [roles],  // Send roles as an array, as per your backend
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Registration successful:', response.data);
        setSuccess('Registration successful! You can now log in.');
        setError(null); // Clear error message
        setEmail('');
        setPassword('');
        setRoles('CUSTOMER'); // Reset the role selection

        // Optionally navigate to login page or home
        navigate("/login");
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSuccess(null); // Clear success message
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleRegisterSubmit} className="login-form">
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
          Register
        </button>
      </form>

      <div className="toggle-action">
        <p>
          Already have an account?{' '}
          <button onClick={() => navigate("/login")} className="toggle-btn">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
