import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '40px 20px',
      marginTop: 'auto',
      boxShadow: '0 -4px 12px rgba(15, 23, 42, 0.02)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div>
          <h3 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>
            HomeShop<span style={{ color: '#ea580c' }}>.</span>
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Premium Modern E-Commerce Platform.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link to="/about" style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>About Us</Link>
          <Link to="/return" style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>Return Policy</Link>
          <Link to="/disclaimer" style={{ color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>Disclaimer</Link>
        </div>
        
        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} HomeShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;