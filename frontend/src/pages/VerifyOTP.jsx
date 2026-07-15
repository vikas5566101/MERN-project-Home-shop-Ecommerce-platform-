import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/auth.css';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // Email passed from Register.jsx
  const email = location.state?.email;

  // If user opens this page directly
  if (!email) {
    navigate('/register');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Email verified successfully!');

        // Save user in AuthContext
        login(data);

        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify OTP</h2>

        <p style={{ marginBottom: '15px', textAlign: 'center' }}>
          OTP sent to
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" className="btn">
          Verify OTP
        </button>

        <p>
          Wrong email? <Link to="/register">Register Again</Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyOTP;