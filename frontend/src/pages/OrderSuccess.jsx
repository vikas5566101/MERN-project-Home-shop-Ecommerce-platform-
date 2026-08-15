import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '50px 30px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
      <h2 style={{ fontSize: '2.4rem', marginBottom: '16px', color: '#15803d', background: 'none', WebkitTextFillColor: 'initial' }}>Order Placed Successfully!</h2>
      <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '36px', lineHeight: '1.6' }}>
        Thank you for your order. We have securely received your transaction details and will process your shipment shortly.
      </p>
      <Link to="/shop" className="btn">Continue Shopping</Link>
    </div>
  );
};

export default OrderSuccess;