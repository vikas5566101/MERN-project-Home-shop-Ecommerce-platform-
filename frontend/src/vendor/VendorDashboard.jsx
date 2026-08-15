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
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(249, 115, 22, 0.3)', borderTop: '3px solid #f97316', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="main-content" style={{ maxWidth: '1200px' }}>
      {/* Banner Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.02) 100%)',
        border: '1px solid rgba(249, 115, 22, 0.2)',
        borderRadius: '24px',
        padding: '40px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%', left: '-10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)', zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <span style={{ padding: '6px 12px', background: 'rgba(249, 115, 22, 0.2)', color: '#f97316', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Vendor Portal</span>
            <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>• Active Status</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome back, {user.name}
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', margin: 0 }}>
            Managing <strong style={{ color: '#f97316', fontWeight: '600' }}>{status.storeName}</strong>
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
         {[
           { label: 'Total Revenue', value: `₹${stats.revenue.toFixed(2)}`, icon: '💰', color: '#10b981' },
           { label: 'Active Products', value: stats.activeProducts, icon: '📦', color: '#3b82f6' },
           { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: '#f59e0b' },
           { label: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: '#8b5cf6' }
         ].map((stat, i) => (
            <div key={i} style={{
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem', margin: '0 0 5px 0' }}>{stat.label}</p>
                <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>{stat.value}</h3>
              </div>
            </div>
         ))}
      </div>

      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Store Management</h2>
      
      {/* Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Add Product Card */}
        <div 
          onClick={() => navigate('/vendor/add-product')}
          style={{
            background: 'linear-gradient(145deg, #18181b 0%, #0f0f11 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '30px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(249, 115, 22, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(249, 115, 22, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#f97316' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 10px 0' }}>Add New Product</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>Create a new listing, set pricing, add images, and start selling.</p>
          
          <div style={{ position: 'absolute', right: '20px', bottom: '20px', color: '#f97316', opacity: 0.5 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </div>

        {/* Manage Products Card */}
        <div 
          onClick={() => navigate('/vendor/products')}
          style={{
            background: 'linear-gradient(145deg, #18181b 0%, #0f0f11 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '30px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#3b82f6' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 10px 0' }}>Manage Products</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>View your inventory, update prices, edit details, or remove items.</p>
          
          <div style={{ position: 'absolute', right: '20px', bottom: '20px', color: '#3b82f6', opacity: 0.5 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </div>

        {/* Manage Orders Card */}
        <div 
          onClick={() => navigate('/vendor/orders')}
          style={{
            background: 'linear-gradient(145deg, #18181b 0%, #0f0f11 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '30px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#10b981' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 10px 0' }}>Manage Orders</h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>Process customer orders, update shipping status, and fulfill items.</p>
          
          <div style={{ position: 'absolute', right: '20px', bottom: '20px', color: '#10b981', opacity: 0.5 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VendorDashboard;
