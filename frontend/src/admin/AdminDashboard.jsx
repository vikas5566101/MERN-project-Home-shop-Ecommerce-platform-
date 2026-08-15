import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  const cardStyle = {
    padding: '24px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px'
  };

  const numberStyle = {
    fontSize: '2.4rem',
    fontWeight: '700',
    color: '#ea580c'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
        <img src="/ShopNestLogo.png" alt="Logo" style={{ height: '38px', width: '38px', borderRadius: '8px', objectFit: 'cover', filter: 'drop-shadow(0 2px 6px rgba(234, 88, 12, 0.25))' }} />
        <h2 style={{ margin: 0, color: '#0f172a', background: 'none', WebkitTextFillColor: 'initial' }}>Admin Dashboard</h2>
      </div>
      <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1.1rem' }}>Welcome back, <span style={{color: '#0f172a', fontWeight: '600'}}>{user?.name}</span></p>
      
      {stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={cardStyle}>
            <h4 style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>Total Orders</h4>
            <div style={numberStyle}>{stats.totalOrders}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>Total Products</h4>
            <div style={numberStyle}>{stats.totalProducts}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>Total Users</h4>
            <div style={numberStyle}>{stats.totalUsers}</div>
          </div>
          <div style={cardStyle}>
            <h4 style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: '500' }}>Total Revenue</h4>
            <div style={numberStyle}>₹{stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', margin: '50px 0', color: '#ea580c', fontWeight: '600' }}>Loading metrics...</div>
      )}

      <div style={{ marginTop: '36px', padding: '32px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
        <h3 style={{ marginBottom: '24px', color: '#0f172a', fontSize: '1.3rem' }}>Administrative Controls</h3>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => navigate('/admin/add-product')}>+ Add Product</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/products')}>📦 Manage Products</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/orders')}>🚚 Manage Orders</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>👥 Users Directory</button>
          <button className="btn" onClick={() => navigate('/admin/vendors')} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>🏪 Vendor Applications</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;