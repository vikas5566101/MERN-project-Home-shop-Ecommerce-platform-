import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }

  const fetchMyOrders = async () => {
    try {
      const res = await fetch('/api/orders/myorders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(Array.isArray(data) ? data : []);
      } else {
        // Token obsolete or 401: clear and bounce
        if (res.status === 401) {
          logout();
          navigate('/login');
        }
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchMyOrders();
}, [user, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '36px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)', color: '#0f172a' };
  const badgeStyle = { background: '#fff7ed', color: '#ea580c', border: '1px solid #ffedd5', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', display: 'inline-block' };

  if (!user) return null;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '28px', marginBottom: '28px' }}>
        <div>
          <h2 style={{ color: '#0f172a', fontSize: '2.2rem', marginBottom: '10px', background: 'none', WebkitTextFillColor: 'initial' }}>My Profile</h2>
          <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '6px' }}><strong style={{ color: '#0f172a' }}>Name:</strong> {user.name}</p>
          <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '16px' }}><strong style={{ color: '#0f172a' }}>Email:</strong> {user.email}</p>
          <span style={badgeStyle}>Account Type: {user.role.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {user.role === 'user' && (
            <Link to="/apply-vendor" className="btn">Become a Vendor</Link>
          )}
          {user.role === 'vendor' && (
            <Link to="/vendor/dashboard" className="btn btn-secondary">Vendor Dashboard</Link>
          )}
          <button onClick={handleLogout} className="btn" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 12px rgba(220,38,38,0.25)' }}>Logout</button>
        </div>
      </div>

      <h3 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.4rem' }}>Order History</h3>
      {loading ? (
        <p style={{ color: '#64748b' }}>Fetching your orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '1.05rem' }}>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn">Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: '#f8fafc', padding: '20px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '4px' }}>Order ID: <span style={{ color: '#0f172a', fontWeight: '600' }}>{order._id}</span></p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '4px' }}>Placed On: <span style={{ color: '#0f172a', fontWeight: '600' }}>{new Date(order.createdAt).toLocaleDateString()}</span></p>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Total: <strong style={{ color: '#ea580c', fontSize: '1rem' }}>₹{order.totalAmount.toFixed(2)}</strong></p>
              </div>
              <div>
                <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Shipped' ? 'badge-info' : 'badge-warning'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;