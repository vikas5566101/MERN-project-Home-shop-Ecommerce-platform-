import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminVendors = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/vendors/applications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setApplications(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user, navigate]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/vendors/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setApplications(applications.filter(app => app._id !== id));
      } else {
        alert('Failed to approve vendor');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;
    try {
      const res = await fetch(`/api/vendors/${id}/reject`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setApplications(applications.filter(app => app._id !== id));
      } else {
        alert('Failed to reject vendor');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ color: '#0f172a', fontSize: '2rem', marginBottom: '20px', background: 'none', WebkitTextFillColor: 'initial' }}>Vendor Applications</h2>
      {loading ? (
        <p style={{ color: '#64748b' }}>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div style={{ background: '#ffffff', padding: '36px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px -2px rgba(15,23,42,0.05)' }}>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>No pending applications.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {applications.map(app => (
            <div key={app._id} style={{ background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px -2px rgba(15,23,42,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#0f172a', margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: '700' }}>{app.storeName}</h4>
                <p style={{ color: '#475569', margin: '0 0 4px 0', fontSize: '0.95rem' }}>Description: {app.description || 'N/A'}</p>
                <p style={{ color: '#64748b', margin: '0', fontSize: '0.9rem' }}>User Email: <span style={{ color: '#0f172a', fontWeight: '500' }}>{app.userId?.email}</span></p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleApprove(app._id)} className="btn" style={{ background: '#16a34a', padding: '8px 18px' }}>Approve</button>
                <button onClick={() => handleReject(app._id)} className="btn" style={{ background: '#dc2626', padding: '8px 18px' }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVendors;
