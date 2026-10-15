import React from 'react';
import OrderItemsList from './OrderItemsList';
import { formatPrice } from '../utils/product';

function OrderSummary({ items, total, children }) {
  return (
    <div className="order-summary-box">
      <h3>Order Summary</h3>
      <OrderItemsList items={items} />
      <div className="order-total-row">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {children && <div style={{ marginTop: '14px' }}>{children}</div>}
    </div>
  );
}

export default OrderSummary;
