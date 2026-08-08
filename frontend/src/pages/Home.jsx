import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BannerSlider from '../components/BannerSlider';

const DEFAULT_CATEGORIES = [
  { name: 'T-Shirts', icon: '👕', description: 'Casual & Graphic Tees' },
  { name: 'Jeans', icon: '👖', description: 'Slim, Regular & Skinny Fit' },
  { name: 'Shirts', icon: '👔', description: 'Formal & Casual Shirts' },
  { name: 'Dresses', icon: '👗', description: 'Midi, Maxi & Party Dresses' },
  { name: 'Kurtis', icon: '👘', description: 'Ethnic & Festive Kurtis' },
  { name: 'Hoodies', icon: '🧥', description: 'Warm Fleece Hoodies' },
  { name: 'Jackets', icon: '🧥', description: 'Winter & Puffer Jackets' },
  { name: 'Tops', icon: '👚', description: 'Trendy Tops & Blouses' },
  { name: 'Sarees', icon: '🥻', description: 'Silk & Traditional Sarees' },
  { name: 'Activewear', icon: '🧘', description: 'Gym & Yoga Apparel' },
  { name: 'Trousers', icon: '👖', description: 'Chinos & Formal Pants' },
  { name: 'Joggers', icon: '🏃', description: 'Sports & Lounge Joggers' },
  { name: 'Shorts', icon: '🩳', description: 'Casual & Training Shorts' },
  { name: 'Skirts', icon: '👗', description: 'A-Line & Pencil Skirts' },
  { name: 'Sweaters', icon: '🧶', description: 'Thermal & Fleece Sweaters' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4)); // Featured products

        // Dynamic category extraction with fallback to presets
        const dynamicCatNames = [...new Set(data.map((p) => p.category).filter(Boolean))];
        if (dynamicCatNames.length > 0) {
          const combined = dynamicCatNames.map((cat) => {
            const found = DEFAULT_CATEGORIES.find((c) => c.name.toLowerCase() === cat.toLowerCase());
            return {
              name: cat,
              icon: found ? found.icon : '📦',
              description: found ? found.description : 'Explore items in this category',
            };
          });
          setCategories(combined);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (error) {
        console.error(error);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">

      {/* Hero Banner Slider */}
      <BannerSlider />

      {/* Shop by Category Section - Single Line Slidable */}
      <section className="categories-section">
        <div className="section-header-with-nav">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore top products curated just for you</p>
          </div>
          <div className="slider-controls">
            <button className="slider-btn" onClick={() => scroll('left')} aria-label="Scroll Left">‹</button>
            <button className="slider-btn" onClick={() => scroll('right')} aria-label="Scroll Right">›</button>
          </div>
        </div>

        <div className="category-slider" ref={sliderRef}>
          {categories.map((cat, index) => (
            <div
              key={index}
              className="category-card"
              onClick={() => handleCategoryClick(cat.name)}
              title={`Shop ${cat.name}`}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3 className="category-name">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section" style={{ marginTop: '50px' }}>
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Handpicked selections with incredible deals</p>
        </div>

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
      </section>

    </div>
  );
};

export default Home;