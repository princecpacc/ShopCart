import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DataState from '../components/DataState';
import OrderItemsList from '../components/OrderItemsList';
import { useFetch } from '../hooks/useFetch';
import { getOrderById } from '../services/orderService';
import { toLineItems } from '../utils/cart';
import { formatPrice } from '../utils/product';
import { formatDate } from '../utils/order';

function statusClass(status) {
  return `order-status-badge status-${status.toLowerCase()}`;
}

function OrderDetails() {
  const { id } = useParams();
  const { data: order, loading, error, reload } = useFetch(() => getOrderById(id), [id]);

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <h1 className="page-title">Order Details</h1>
        <DataState
          loading={loading}
          error={error}
          onRetry={reload}
          loadingText="Loading your order..."
          errorText="We couldn't load this order."
        >
          {order && (
            <div className="order-detail-card">
              <div className="order-detail-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <span className={statusClass(order.status)}>{order.status.replace('_', ' ')}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              <hr className="divider" />

              <div className="order-detail-section">
                <h3>Items</h3>
                <OrderItemsList items={toLineItems(order.items)} />
                <div className="order-total-row" style={{ marginTop: '12px' }}>
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              <hr className="divider" />

              <div className="order-detail-section">
                <h3>Shipping Address</h3>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.pincode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>

              <Link className="button-link" style={{ alignSelf: 'flex-start' }} to="/orders">
                ← Back to My Orders
              </Link>
            </div>
          )}
        </DataState>
      </div>
    </div>
  );
}

export default OrderDetails;
