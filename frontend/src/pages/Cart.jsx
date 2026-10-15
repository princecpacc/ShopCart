import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { getSubtotal, getItemCount } from '../utils/cart';
import { formatPrice } from '../utils/product';

function Cart() {
  const { cartItems, loading, error, refreshCart } = useCart();

  function renderContent() {
    if (loading) {
      return <p className="loading-text">Loading your cart...</p>;
    }

    if (error) {
      return (
        <div className="empty-state">
          <h3>Unable to load your cart.</h3>
          <button className="btn-primary" onClick={refreshCart}>Try Again</button>
        </div>
      );
    }

    if (cartItems.length === 0) {
      return (
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added anything yet."
          linkTo="/products"
          linkText="Browse Products"
        />
      );
    }

    const subtotal = getSubtotal(cartItems);
    const itemCount = getItemCount(cartItems);

    return (
      <>
        <div className="cart-list">
          {cartItems.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>

        <div className="order-summary-box" style={{ maxWidth: '360px' }}>
          <h3>Order Summary</h3>
          <div className="order-total-row" style={{ marginBottom: '14px' }}>
            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Link className="button-link btn-full" to="/checkout">
            Proceed to Checkout
          </Link>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <h1 className="page-title">My Cart</h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default Cart;
