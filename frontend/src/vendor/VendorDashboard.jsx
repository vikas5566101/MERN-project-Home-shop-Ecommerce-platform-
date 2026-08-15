import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [stats, setStats] = useState({ revenue: 0, activeProducts: 0, pendingOrders: 0, totalCustomers: 0 });
  
  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login');
      return;
    }
    
    // Quick check to see if they are an approved vendor
    const checkStatusAndStats = async () => {
      try {
        const res = await fetch('/api/vendors/status', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (data.status !== 'approved') {
          navigate('/apply-vendor');
        } else {
          setStatus(data);
          // Fetch stats if approved
          const statsRes = await fetch('/api/vendors/stats', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const statsData = await statsRes.json();
          if (statsRes.ok) {
            setStats(statsData);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkStatusAndStats();
  }, [user, navigate]);

  if (!status) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(234, 88, 12, 0.3)', borderTop: '3px solid #ea580c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

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
    <div className="main-content" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.05) 0%, rgba(234, 88, 12, 0.01) 100%)',
        border: '1px solid rgba(234, 88, 12, 0.2)',
        borderRadius: '24px',
        padding: '40px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%', left: '-10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)', zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <span style={{ padding: '6px 12px', background: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Vendor Portal</span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>• Active Status</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', background: 'linear-gradient(to right, #0f172a, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome back, {user.name}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>
            Managing <strong style={{ color: '#ea580c', fontWeight: '600' }}>{status.storeName}</strong>
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
         {[
           { label: 'Total Revenue', value: `₹${stats.revenue?.toFixed(2) || '0.00'}`, icon: '💰', color: '#10b981' },
           { label: 'Active Products', value: stats.activeProducts || 0, icon: '📦', color: '#3b82f6' },
           { label: 'Pending Orders', value: stats.pendingOrders || 0, icon: '⏳', color: '#f59e0b' },
           { label: 'Total Customers', value: stats.totalCustomers || 0, icon: '👥', color: '#8b5cf6' }
         ].map((stat, i) => (
            <div key={i} style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 5px 0' }}>{stat.label}</p>
                <h3 style={{ color: '#0f172a', fontSize: '1.5rem', margin: 0 }}>{stat.value}</h3>
              </div>
            </div>
         ))}
      </div>

      <h2 style={{ color: '#0f172a', fontSize: '1.8rem', marginBottom: '20px' }}>Store Management</h2>
      
      {/* Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        
        {/* Add Product Card */}
        <div style={cardStyle} onClick={() => navigate('/vendor/add-product')} onMouseOver={(e) => e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>➕</div>
          <h3 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem' }}>Add New Product</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>List a new item in your store</p>
        </div>

        {/* Manage Products Card */}
        <div style={cardStyle} onClick={() => navigate('/vendor/products')} onMouseOver={(e) => e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>📦</div>
          <h3 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem' }}>Manage Products</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Edit or delete your listings</p>
        </div>

        {/* Manage Orders Card */}
        <div style={cardStyle} onClick={() => navigate('/vendor/orders')} onMouseOver={(e) => e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform='translateY(0)'}>
          <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🚚</div>
          <h3 style={{ color: '#0f172a', margin: 0, fontSize: '1.2rem' }}>Manage Orders</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Fulfill your incoming sales</p>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;
