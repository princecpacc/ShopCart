import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getWishlist } from '../services/wishlistService';

function Home() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function init() {
      try {
        const [profileRes, productsRes, wishlistItems] = await Promise.all([
          api.get('/customers/me'),
          api.get('/products'),
          getWishlist().catch(() => [])
        ]);

        if (!ignore) {
          setCustomer(profileRes.data);
          setProducts(productsRes.data.products.slice(0, 8));
          setWishlistIds(new Set(wishlistItems.map((item) => item._id)));
        }
      } catch (err) {
        if (ignore) return;
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError('Could not load your profile. Please try again.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    init();

    return () => {
      ignore = true;
    };
  }, [navigate]);

  function handleWishlistChange(productId, saved) {
    setWishlistIds((current) => {
      const next = new Set(current);
      if (saved) next.add(productId);
      else next.delete(productId);
      return next;
    });
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="page-wrapper">
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="page-wrapper">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="home-hero">
          <div className="home-hero-text">
            <h1 className="page-title" style={{ marginBottom: '6px' }}>
              Welcome back, {customer.fullName}
            </h1>
            <p className="home-hero-sub">Discover products picked for you today.</p>
          </div>
          <Link className="button-link" to="/products">Browse All Products</Link>
        </div>

        <h2 className="section-heading">Recommended for You</h2>

        {products.length === 0 ? (
          <p className="loading-text">No products available right now.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistIds.has(product._id)}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
