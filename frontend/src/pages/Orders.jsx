import React from 'react';
import Navbar from '../components/Navbar';
import DataState from '../components/DataState';
import EmptyState from '../components/EmptyState';
import OrderCard from '../components/OrderCard';
import { useFetch } from '../hooks/useFetch';
import { getOrders } from '../services/orderService';

function Orders() {
  const { data: orders, loading, error, reload } = useFetch(getOrders);

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <h1 className="page-title">My Orders</h1>
        <DataState
          loading={loading}
          error={error}
          onRetry={reload}
          loadingText="Loading your orders..."
          errorText="We couldn't load your orders."
        >
          {orders && orders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              message="You have not placed any orders yet."
              linkTo="/products"
              linkText="Start Shopping"
            />
          ) : (
            <div className="orders-list">
              {orders && orders.map((order) => <OrderCard key={order._id} order={order} />)}
            </div>
          )}
        </DataState>
      </div>
    </div>
  );
}

export default Orders;
