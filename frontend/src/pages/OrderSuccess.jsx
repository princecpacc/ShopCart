import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DataState from '../components/DataState';
import { useFetch } from '../hooks/useFetch';
import { getOrderById } from '../services/orderService';
import { formatPrice } from '../utils/product';

function OrderSuccess() {
  const { id } = useParams();
  const { data: order, loading, error, reload } = useFetch(() => getOrderById(id), [id]);

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <DataState
          loading={loading}
          error={error}
          onRetry={reload}
          loadingText="Loading your order..."
          errorText="We couldn't load your order."
        >
          {order && (
            <div className="success-page">
              <div className="success-checkmark">
                <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" />
                  <path d="M14 26l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>Order Placed!</h2>
              <p>Order #{order._id.slice(-8)}</p>
              <p>Total: {formatPrice(order.totalAmount)}</p>
              <p>Status: {order.status}</p>
              <p style={{ marginTop: '8px' }}>Your order has been saved successfully.</p>
              <div className="success-actions">
                <Link className="button-link" to="/orders">View My Orders</Link>
                <Link className="button-link secondary" to="/products">Continue Shopping</Link>
              </div>
            </div>
          )}
        </DataState>
      </div>
    </div>
  );
}

export default OrderSuccess;
