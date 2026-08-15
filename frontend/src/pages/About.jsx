import React from 'react';

const About = () => {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    background: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
    textAlign: 'center'
  };

  const socialBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    margin: '6px',
    padding: '10px 18px',
    background: '#f8fafc',
    color: '#0f172a',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.25s ease',
    border: '1px solid #cbd5e1'
  };

  return (
    <div style={containerStyle}>
      <img
        src="/vikasDp.png"
        alt="@Pvikas"
        style={{ width: '170px', height: '170px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #ea580c', marginBottom: '20px', boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)' }}
      />
      <h2 style={{ fontSize: '2.5rem', marginBottom: '8px', color: '#0f172a', background: 'none', WebkitTextFillColor: 'initial' }}>About Me</h2>
      <h3 style={{ fontSize: '1.4rem', color: '#ea580c', marginBottom: '16px', fontWeight: '600' }}>Vikas Kumar Prajapati (@pvikas101)</h3>

      <p style={{ color: '#475569', fontSize: '1.15rem', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 30px auto' }}>
        <strong style={{ color: '#0f172a' }}>Join the community and grow together!</strong> Welcome to my platform where we build, deploy, and scale highly engineered systems.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <a href="https://69de90cdc5337cc0b75039b6--vikas-prajapati-portfolio13dbd5.netlify.app/" target="_blank" rel="noreferrer" style={socialBtnStyle}>🌐 Website</a>
        <a href="https://www.youtube.com/@youareamazing8690" target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' }}>📺 YouTube</a>
        <a href="https://www.instagram.com/vikas__45kp/" target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: '#fdf2f8', borderColor: '#fbcfe8', color: '#db2777' }}>📸 Instagram</a>
        <a href="https://www.linkedin.com/in/vikas-kumar-prajapati-2850382a4/" target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: '#eff6ff', borderColor: '#bfdbfe', color: '#2563eb' }}>💼 LinkedIn</a>
        <a href="https://x.com/VikasKP101" target="_blank" rel="noreferrer" style={socialBtnStyle}>✖️ X (Twitter)</a>
        <a href="https://github.com/vikas5566101" target="_blank" rel="noreferrer" style={{ ...socialBtnStyle, background: '#ecfdf5', borderColor: '#a7f3d0', color: '#059669' }}>💬 GitHub</a>
        <a href="https://leetcode.com/u/VikasKumarPrajapati/" target="_blank" rel="noreferrer" style={socialBtnStyle}>🔗 Leetcode</a>
      </div>
    </div>
  );
};

export default About;