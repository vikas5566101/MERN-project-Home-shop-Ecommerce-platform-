import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else if (location.state?.category) {
      setSelectedCategory(location.state.category);
    } else {
      setSelectedCategory('All');
    }
  }, [location.search, location.state]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shop-container">
      <h2>All Products</h2>

      <input
        type="text"
        placeholder="Search products by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* Category Filter Chips */}
      <div className="category-chips">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ color: '#a1a1aa', marginTop: '30px', textAlign: 'center' }}>
          No products found in category "{selectedCategory}".
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;