import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    };
    fetchUsers();
  }, [user]);

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#0f172a', marginBottom: '20px', background: 'none', WebkitTextFillColor: 'initial' }}>User Directory</h2>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>EMAIL</th>
              <th style={thStyle}>ROLE</th>
              <th style={thStyle}>JOINED</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={rowStyle}>
                <td style={tdStyle}>{u._id.substring(0, 8)}...</td>
                <td style={{ ...tdStyle, fontWeight: '600' }}>{u.name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>
                  <span style={{ 
                    background: u.role === 'admin' ? '#fff7ed' : '#dcfce7', 
                    color: u.role === 'admin' ? '#ea580c' : '#15803d', 
                    border: u.role === 'admin' ? '1px solid #ffedd5' : '1px solid #bbf7d0',
                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' 
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '32px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)', color: '#0f172a' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid #e2e8f0' };
const thStyle = { padding: '14px 18px', textAlign: 'left', color: '#475569', fontSize: '0.85rem', fontWeight: '600', background: '#f8fafc' };
const tdStyle = { padding: '16px 18px', textAlign: 'left', color: '#0f172a' };

export default AdminUsers;