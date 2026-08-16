import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        qty: 1
      }));
      alert('Successfully added to your cart!');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '100px', color: '#ea580c', fontSize: '1.2rem', fontWeight: '600' }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: 'center', margin: '100px', color: '#dc2626', fontSize: '1.2rem', fontWeight: '600' }}>Product Not Found</div>;

  return (
    <div className="product-detail-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.95rem' }}>
        <Link to="/" style={{ color: '#ea580c', fontWeight: '500' }}>Home</Link> / <Link to="/shop" style={{ color: '#ea580c', fontWeight: '500' }}>Shop</Link> / {product.category} / <span style={{ color: '#0f172a', fontWeight: '600' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        {/* Left Side: Image */}
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        {/* Right Side: Information Block */}
        <div className="detail-info">
          
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#0f172a' }}>{product.name}</h2>

          <p className="detail-price" style={{ fontSize: '2.4rem', margin: '15px 0', color: '#ea580c' }}>₹{product.price.toFixed(2)}</p>

          {/* Description */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#0f172a', marginBottom: '10px', fontSize: '1.1rem' }}>Product Description</h4>
            <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1rem' }}>{product.description}</p>
          </div>

          {/* Vendor Details */}
          {product.vendorId && (
            <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(249, 115, 22, 0.05)', borderRadius: '10px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
              <h4 style={{ color: '#f97316', marginBottom: '8px', fontSize: '1.1rem' }}>Sold By: {product.vendorId.storeName}</h4>
              {product.vendorId.description && (
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                  {product.vendorId.description}
                </p>
              )}
            </div>
          )}

          {/* Cart & Stock Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={handleAddToCart} className="btn" style={{ flexGrow: '1', padding: '16px', fontSize: '1.1rem' }}>
              Add to Shopping Cart
            </button>
          </div>
          
          <p style={{ marginTop: '20px', color: product.stock > 0 ? '#15803d' : '#dc2626', fontWeight: '600', fontSize: '0.95rem' }}>
            {product.stock > 0 ? `● In Stock (${product.stock} units available)` : `● Temporarily Out of Stock`}
          </p>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;