import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VendorOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login');
      return;
    }

    const fetchVendorOrders = async () => {
      try {
        const res = await fetch('/api/orders/vendor-orders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          console.error('Failed to fetch vendor orders', data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
  }, [user, navigate]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/vendor-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        alert('Status updated successfully!');
        // Locally update the status to avoid refetching
        setOrders(orders.map(o => {
          if (o._id === orderId) {
            return {
              ...o,
              items: o.items.map(item => ({ ...item, status: newStatus }))
            };
          }
          return o;
        }));
      } else {
        const data = await res.json();
        alert(data.message || 'Error updating status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  const containerStyle = { maxWidth: '1000px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };

  if (loading) return <div style={{ color: '#f97316', textAlign: 'center', marginTop: '50px' }}>Loading Orders...</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '20px' }}>Vendor Orders</h2>
      <p style={{ color: '#a1a1aa', marginBottom: '30px' }}>Manage the shipping status for items ordered from your store.</p>

      {orders.length === 0 ? (
        <div style={{ background: '#09090b', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#a1a1aa' }}>You don't have any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => {
            // Determine a visual status based on the items this vendor sold in this order
            const isDelivered = order.items.every(i => i.status === 'Delivered');
            const isShipped = order.items.every(i => i.status === 'Shipped' || i.status === 'Delivered');
            const visualStatus = isDelivered ? 'Delivered' : isShipped ? 'Shipped' : 'Pending';

            return (
              <div key={order._id} style={{ background: '#09090b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '15px', marginBottom: '15px' }}>
                  <div>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Order ID: <span style={{ color: '#fff' }}>{order._id}</span></p>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '5px' }}>Customer: <span style={{ color: '#fff' }}>{order.user?.name} ({order.user?.email})</span></p>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Placed On: <span style={{ color: '#fff' }}>{new Date(order.createdAt).toLocaleDateString()}</span></p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Your Payout: ₹{order.totalAmount.toFixed(2)}</p>
                    <span style={{ 
                      background: visualStatus === 'Delivered' ? 'rgba(16,185,129,0.1)' : visualStatus === 'Shipped' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)', 
                      color: visualStatus === 'Delivered' ? '#10b981' : visualStatus === 'Shipped' ? '#3b82f6' : '#f59e0b',
                      padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' 
                    }}>
                      {visualStatus}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ color: '#f97316', marginBottom: '10px', fontSize: '1rem' }}>Items to Fulfill:</h4>
                  {order.items.map(item => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', background: '#18181b', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                      <span style={{ color: '#fff' }}>{item.qty}x {item.name}</span>
                      <span style={{ color: '#a1a1aa' }}>₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                    <strong>Shipping To: </strong>{order.address.street}, {order.address.city}, {order.address.postalCode}, {order.address.country}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => updateStatus(order._id, 'Shipped')} 
                      disabled={visualStatus !== 'Pending'}
                      className="btn" 
                      style={{ background: visualStatus !== 'Pending' ? '#27272a' : '#3b82f6', padding: '8px 16px', fontSize: '0.9rem' }}>
                      Mark Shipped
                    </button>
                    <button 
                      onClick={() => updateStatus(order._id, 'Delivered')} 
                      disabled={visualStatus === 'Delivered'}
                      className="btn" 
                      style={{ background: visualStatus === 'Delivered' ? '#27272a' : '#10b981', padding: '8px 16px', fontSize: '0.9rem' }}>
                      Mark Delivered
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
