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
    if (!user) return;
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
    fetchStatus();
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

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

  const containerStyle = { maxWidth: '540px', margin: '40px auto', padding: '36px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)', color: '#0f172a' };

  if (status) {
    return (
      <div style={containerStyle}>
        <h2 style={{ color: '#0f172a', fontSize: '2rem', marginBottom: '20px', textAlign: 'center', background: 'none', WebkitTextFillColor: 'initial' }}>Vendor Application</h2>
        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <h3 style={{ color: '#ea580c', marginBottom: '10px', fontSize: '1.3rem' }}>Store: {storeNameDisplay}</h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#0f172a' }}>
            Status: <span style={{ color: status === 'approved' ? '#15803d' : '#b45309', fontWeight: 'bold' }}>{status.toUpperCase()}</span>
          </p>
          {status === 'pending' && <p style={{ color: '#64748b' }}>Your application is currently being reviewed by an admin.</p>}
          {status === 'approved' && <p style={{ color: '#64748b' }}>Congratulations! You are now an approved vendor.</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#0f172a', fontSize: '2rem', marginBottom: '20px', textAlign: 'center', background: 'none', WebkitTextFillColor: 'initial' }}>Apply to be a Vendor</h2>
      {message && <p style={{ color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{message}</p>}
      {error && <p style={{ color: '#dc2626', background: '#fee2e2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', color: '#475569', fontWeight: '500' }}>Store Name *</label>
          <input 
            type="text" 
            value={storeName} 
            onChange={(e) => setStoreName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '15px', outline: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', color: '#475569', fontWeight: '500' }}>Store Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows="4"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '15px', outline: 'none' }}
          ></textarea>
        </div>
        <button type="submit" disabled={loading} className="btn" style={{ marginTop: '10px' }}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplyVendor;
