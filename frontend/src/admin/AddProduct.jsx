import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '', vendorId: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      const fetchVendors = async () => {
        try {
          const res = await fetch('/api/vendors/approved', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          const data = await res.json();
          if (res.ok) setVendors(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchVendors();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');
    if (!formData.vendorId) return alert('Please select a vendor for this product');
    
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('vendorId', formData.vendorId);
    data.append('image', image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: data
      });
      const responseData = await res.json();
      
      if (res.ok) {
        alert('Product created successfully with Cloudinary Image URL!');
        navigate('/shop');
      } else {
        alert(responseData.message || 'Error creating product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
      <h2 style={{ color: '#0f172a', marginBottom: '24px', background: 'none', WebkitTextFillColor: 'initial' }}>Add New Product (Admin)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <select 
          required 
          value={formData.vendorId} 
          onChange={(e) => setFormData({...formData, vendorId: e.target.value})} 
          style={inputStyle}
        >
          <option value="" disabled>-- Select Vendor --</option>
          {vendors.map(v => (
            <option key={v._id} value={v._id}>{v.storeName} ({v.userId.email})</option>
          ))}
        </select>

        <input 
          type="text" placeholder="Product Name" required 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          style={inputStyle} 
        />
        <textarea 
          placeholder="Description" required rows="4"
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="number" placeholder="Price" required 
          onChange={(e) => setFormData({...formData, price: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="text" placeholder="Category" required 
          onChange={(e) => setFormData({...formData, category: e.target.value})} 
          style={inputStyle} 
        />
        <input 
          type="number" placeholder="Stock Quantity" required 
          onChange={(e) => setFormData({...formData, stock: e.target.value})} 
          style={inputStyle} 
        />
        
        <div style={{ padding: '18px', border: '1px dashed #ea580c', borderRadius: '10px', background: '#fff7ed' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>Upload Product Image (Cloudinary)</label>
          <input 
            type="file" accept="image/*" required 
            onChange={(e) => setImage(e.target.files[0])} 
            style={{ color: '#0f172a' }}
          />
        </div>

        <button type="submit" disabled={loading} className="btn" style={{ marginTop: '10px' }}>
          {loading ? 'Uploading & Creating...' : 'Publish Product'}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '12px 16px',
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  color: '#0f172a',
  fontSize: '15px',
  outline: 'none'
};

export default AddProduct;