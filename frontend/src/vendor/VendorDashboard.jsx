import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login');
      return;
    }
    
    // Quick check to see if they are an approved vendor
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/vendors/status', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (data.status !== 'approved') {
          navigate('/apply-vendor');
        } else {
          setStatus(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkStatus();
  }, [user, navigate]);

  if (!status) return <div style={{ color: '#ea580c', textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', fontWeight: '600' }}>Loading Dashboard...</div>;

  const cardStyle = {
    padding: '30px 24px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#0f172a', fontSize: '2.2rem', marginBottom: '6px', background: 'none', WebkitTextFillColor: 'initial' }}>Vendor Dashboard</h2>
      <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1.1rem' }}>Store: <strong style={{ color: '#ea580c' }}>{status.storeName}</strong></p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={cardStyle} onClick={() => navigate('/vendor/add-product')} onMouseOver={(e) => e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>➕</div>
          <h3 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem' }}>Add New Product</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>List a new item in your store</p>
        </div>
        <div style={cardStyle} onClick={() => navigate('/vendor/products')} onMouseOver={(e) => e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>📦</div>
          <h3 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem' }}>Manage Products</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Edit or delete your listings</p>
        </div>
        <div style={{ ...cardStyle, opacity: 0.5, cursor: 'not-allowed', background: '#f8fafc' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🚚</div>
          <h3 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem' }}>Manage Orders</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Coming in Phase 3!</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
