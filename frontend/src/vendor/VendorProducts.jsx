import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VendorProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login');
      return;
    }
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products/vendor-products', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', marginBottom: '20px', fontSize: '0.95rem', fontWeight: '500' }}>← Back</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#0f172a', fontSize: '2rem', margin: 0, background: 'none', WebkitTextFillColor: 'initial' }}>My Products</h2>
        <button onClick={() => navigate('/vendor/add-product')} className="btn">+ Add Product</button>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading products...</p>
      ) : products.length === 0 ? (
        <div style={{ background: '#ffffff', padding: '36px', borderRadius: '14px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px -2px rgba(15,23,42,0.05)' }}>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>You have not listed any products yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {products.map(product => (
            <div key={product._id} style={{ background: '#ffffff', borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px -2px rgba(15,23,42,0.05)' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', background: '#f8fafc' }} />
              <div style={{ padding: '18px' }}>
                <h3 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600' }}>{product.name}</h3>
                <p style={{ color: '#ea580c', fontSize: '1.2rem', fontWeight: '700', margin: '0 0 8px 0' }}>₹{product.price.toFixed(2)}</p>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '16px' }}>Stock: {product.stock}</p>
                <div style={{ display: 'flex', gap: '10px' }}>

                  <button onClick={() => navigate(`/vendor/edit-product/${product._id}`)} className="btn" style={{ background: '#3b82f6', flex: 1 }}>Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="btn" style={{ background: '#dc2626', flex: 1, padding: '8px' }}>Delete</button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
