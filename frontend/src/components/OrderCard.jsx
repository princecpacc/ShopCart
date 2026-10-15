import React from 'react';
import { Link } from 'react-router-dom';
import OrderItemsList from './OrderItemsList';
import { formatPrice } from '../utils/product';
import { formatDate, shortOrderId } from '../utils/order';
import { toLineItems } from '../utils/cart';

function statusClass(status) {
  return `order-status-badge status-${status.toLowerCase()}`;
}

function OrderCard({ order }) {
  return (
    <div className="order-card">
      <div className="order-card-header">
        <span className="order-id">Order #{shortOrderId(order._id)}</span>
        <span className="order-date">{formatDate(order.createdAt)}</span>
      </div>

      <OrderItemsList items={toLineItems(order.items)} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="order-id" style={{ fontWeight: 700 }}>{formatPrice(order.totalAmount)}</span>
        <span className={statusClass(order.status)}>{order.status.replace('_', ' ')}</span>
      </div>

      <Link className="button-link" to={`/orders/${order._id}`} style={{ marginTop: '4px' }}>
        View Details
      </Link>
    </div>
  );
}

export default OrderCard;
