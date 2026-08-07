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
    fetchProducts();
  }, [user, navigate]);

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
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', marginBottom: '20px' }}>← Back</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '2rem' }}>My Products</h2>
        <button onClick={() => navigate('/vendor/add-product')} className="btn" style={{ background: '#f97316', padding: '10px 20px' }}>+ Add Product</button>
      </div>

      {loading ? (
        <p style={{ color: '#a1a1aa' }}>Loading products...</p>
      ) : products.length === 0 ? (
        <div style={{ background: '#09090b', padding: '30px', borderRadius: '8px', textAlign: 'center', border: '1px solid #27272a' }}>
          <p style={{ color: '#a1a1aa' }}>You have not listed any products yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <div key={product._id} style={{ background: '#18181b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #27272a' }}>
              <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h3 style={{ color: '#fff', margin: '0 0 10px 0' }}>{product.name}</h3>
                <p style={{ color: '#f97316', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 10px 0' }}>₹{product.price.toFixed(2)}</p>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '15px' }}>Stock: {product.stock}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleDelete(product._id)} className="btn" style={{ background: '#ef4444', flex: 1 }}>Delete</button>
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
