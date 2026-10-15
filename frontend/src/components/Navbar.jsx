import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getWishlistCount, onWishlistChanged } from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import { getItemCount } from '../utils/cart';

function Navbar() {
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const { cartItems } = useCart();
  const cartCount = getItemCount(cartItems);

  useEffect(() => {
    let ignore = false;

    async function loadCount() {
      try {
        const count = await getWishlistCount();
        if (!ignore) setWishlistCount(count);
      } catch (err) {
        // silent — not logged in or network issue
      }
    }

    loadCount();
    const unsubscribe = onWishlistChanged(loadCount);

    return () => {
      ignore = true;
      unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      await api.post('/customers/logout');
    } catch (err) {
      // proceed regardless
    }
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/home">ShopKart</Link>

      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/wishlist">
          <span className="navbar-badge">
            Wishlist
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </span>
        </Link>
        <Link to="/cart">
          <span className="navbar-badge">
            Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </span>
        </Link>
        <Link to="/orders">Orders</Link>
      </div>

      <button className="navbar-logout" onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
