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
    fetchApplications();
  }, [user, navigate]);

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
      <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px' }}>Vendor Applications</h2>
      {loading ? (
        <p style={{ color: '#a1a1aa' }}>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div style={{ background: '#09090b', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#a1a1aa' }}>No pending applications.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {applications.map(app => (
            <div key={app._id} style={{ background: '#09090b', padding: '20px', borderRadius: '12px', border: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#f97316', margin: '0 0 5px 0', fontSize: '1.2rem' }}>{app.storeName}</h4>
                <p style={{ color: '#a1a1aa', margin: '0 0 5px 0', fontSize: '0.9rem' }}>Description: {app.description || 'N/A'}</p>
                <p style={{ color: '#a1a1aa', margin: '0', fontSize: '0.9rem' }}>User Email: {app.userId?.email}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleApprove(app._id)} className="btn" style={{ background: '#10b981', padding: '8px 16px' }}>Approve</button>
                <button onClick={() => handleReject(app._id)} className="btn" style={{ background: '#ef4444', padding: '8px 16px' }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVendors;
