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

  if (!status) return <div style={{ color: '#f97316', textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</div>;

  const cardStyle = {
    padding: '25px', background: '#18181b', border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px', textAlign: 'center', cursor: 'pointer', transition: '0.2s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '5px' }}>Vendor Dashboard</h2>
      <p style={{ color: '#a1a1aa', marginBottom: '30px', fontSize: '1.1rem' }}>Store: <strong style={{ color: '#f97316' }}>{status.storeName}</strong></p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={cardStyle} onClick={() => navigate('/vendor/add-product')} onMouseOver={(e) => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>➕</div>
          <h3 style={{ color: '#fff', margin: 0 }}>Add New Product</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '5px' }}>List a new item in your store</p>
        </div>
        <div style={cardStyle} onClick={() => navigate('/vendor/products')} onMouseOver={(e) => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
          <h3 style={{ color: '#fff', margin: 0 }}>Manage Products</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '5px' }}>Edit or delete your listings</p>
        </div>
        <div style={{ ...cardStyle, opacity: 0.5, cursor: 'not-allowed' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚚</div>
          <h3 style={{ color: '#fff', margin: 0 }}>Manage Orders</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '5px' }}>Coming in Phase 3!</p>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
