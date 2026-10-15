import api from './api';

export async function createPaymentOrder(shippingAddress) {
  const res = await api.post('/orders/create-payment-order', { shippingAddress });
  return res.data;
}

export async function verifyPayment(payload) {
  const res = await api.post('/orders/verify-payment', payload);
  return res.data.order;
}

export async function getOrders() {
  const res = await api.get('/orders');
  return res.data.orders;
}

export async function getOrderById(id) {
  const res = await api.get(`/orders/${id}`);
  return res.data.order;
}
