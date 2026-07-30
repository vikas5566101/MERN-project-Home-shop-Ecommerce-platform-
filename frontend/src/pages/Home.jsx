import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BannerSlider from '../components/BannerSlider';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4)); // Featured products
        setCategories([...new Set(data.map(p => p.category).filter(Boolean))]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">

      {/* Hero Banner Slider */}
      <BannerSlider />

      {/* Categories Section */}
      <h2>Shop by Category</h2>
      {loading ? (
        <div>Loading categories...</div>
      ) : (
        <div className="category-grid" style={{ display: 'flex', gap: '15px', overflowX: 'auto', marginBottom: '40px', padding: '10px 0' }}>
          {categories.map((cat) => (
            <div
              key={cat}
              className="category-card"
              onClick={() => navigate('/shop', { state: { category: cat } })}
              style={{ padding: '20px', minWidth: '150px', textAlign: 'center', backgroundColor: '#f4f4f4', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{cat}</h3>
            </div>
          ))}
        </div>
      )}

      {/* Featured Products */}
      <h2>Featured Products</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;