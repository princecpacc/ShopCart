import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import EmptyState from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { createPaymentOrder, verifyPayment } from '../services/orderService';
import { loadRazorpayScript, payWithRazorpay } from '../utils/razorpay';
import { UserFacingError, getErrorMessage } from '../utils/errors';
import { EMPTY_SHIPPING, cleanShipping, validateShipping } from '../utils/shipping';
import { getSubtotal, toLineItems } from '../utils/cart';

async function confirmPayment(shopKartOrderId, payment) {
  try {
    return await verifyPayment({ shopKartOrderId, ...payment });
  } catch (err) {
    if (err.response && err.response.status === 400) throw err;

    throw new UserFacingError(
      'Your payment went through, but we could not confirm your order. ' +
        'Please do not pay again - check My Orders in a moment.'
    );
  }
}

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, loading, clearCart } = useCart();

  const [values, setValues] = useState(EMPTY_SHIPPING);
  const [errors, setErrors] = useState({});

  const placeOrder = useAsyncAction((err) =>
    getErrorMessage(err, 'Unable to place your order. Please try again.')
  );

  function handleChange(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const found = validateShipping(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    placeOrder.run(async () => {
      const shippingAddress = cleanShipping(values);

      const checkout = await createPaymentOrder(shippingAddress);

      if (!(await loadRazorpayScript())) {
        throw new UserFacingError(
          'Unable to load the payment window. Check your connection and try again.'
        );
      }
      const payment = await payWithRazorpay({
        checkout,
        prefill: { name: shippingAddress.fullName, contact: shippingAddress.phone }
      });

      const order = await confirmPayment(checkout.shopKartOrderId, payment);

      clearCart();
      navigate(`/order-success/${order._id}`);
    });
  }

  function renderContent() {
    if (loading) {
      return <p className="loading-text">Loading your cart...</p>;
    }

    if (cartItems.length === 0) {
      return (
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Add some products before checking out."
          linkTo="/products"
          linkText="Browse Products"
        />
      );
    }

    return (
      <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
        <CheckoutForm
          values={values}
          errors={errors}
          onChange={handleChange}
          disabled={placeOrder.saving}
        />

        <OrderSummary items={toLineItems(cartItems)} total={getSubtotal(cartItems)}>
          <button type="submit" className="btn-primary btn-full" disabled={placeOrder.saving}>
            {placeOrder.saving ? 'Processing...' : 'Place Order'}
          </button>
          {placeOrder.error && <div className="error" style={{ marginTop: '8px' }}>{placeOrder.error}</div>}
        </OrderSummary>
      </form>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <h1 className="page-title">Checkout</h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default Checkout;
