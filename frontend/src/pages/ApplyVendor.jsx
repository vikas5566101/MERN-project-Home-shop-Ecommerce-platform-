import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ApplyVendor = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [status, setStatus] = useState(null);
  const [storeNameDisplay, setStoreNameDisplay] = useState('');

  useEffect(() => {
    if (user) {
      fetchStatus();
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/vendors/status', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (res.ok && data.status !== 'none') {
        setStatus(data.status);
        setStoreNameDisplay(data.storeName);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/vendors/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ storeName, description })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Your application has been submitted successfully and is pending admin approval.');
        setStoreName('');
        setDescription('');
        setStatus('pending');
        setStoreNameDisplay(storeName);
      } else {
        setError(data.message || 'Application failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = { maxWidth: '500px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };

  if (status) {
    return (
      <div style={containerStyle}>
        <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Vendor Application</h2>
        <div style={{ background: '#27272a', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#f97316', marginBottom: '10px' }}>Store: {storeNameDisplay}</h3>
          <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            Status: <span style={{ color: status === 'approved' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>{status.toUpperCase()}</span>
          </p>
          {status === 'pending' && <p style={{ color: '#a1a1aa' }}>Your application is currently being reviewed by an admin.</p>}
          {status === 'approved' && <p style={{ color: '#a1a1aa' }}>Congratulations! You are now an approved vendor.</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px', textAlign: 'center' }}>Apply to be a Vendor</h2>
      {message && <p style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{message}</p>}
      {error && <p style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#a1a1aa' }}>Store Name *</label>
          <input 
            type="text" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #3f3f46', background: '#27272a', color: '#fff' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', color: '#a1a1aa' }}>Store Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows="4"
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #3f3f46', background: '#27272a', color: '#fff' }}
          ></textarea>
        </div>
        <button type="submit" disabled={loading} style={{ background: '#f97316', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyVendor;
