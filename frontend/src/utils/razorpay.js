import { UserFacingError } from './errors';

const CHECKOUT_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = CHECKOUT_SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function payWithRazorpay({ checkout, prefill }) {
  return new Promise((resolve, reject) => {
    let lastFailure = null;

    const razorpay = new window.Razorpay({
      key: checkout.key,
      amount: checkout.amount,
      currency: checkout.currency,
      order_id: checkout.razorpayOrderId,
      name: 'ShopKart',
      description: 'ShopKart Order',
      prefill,
      handler: resolve,
      modal: {
        ondismiss: () => {
          reject(
            new UserFacingError(
              lastFailure
                ? `Payment failed (${lastFailure}). Your cart has not been cleared. Please try again.`
                : 'Payment cancelled. Your cart has not been cleared.'
            )
          );
        }
      }
    });

    razorpay.on('payment.failed', (response) => {
      lastFailure = response.error.description || 'unknown reason';
    });

    razorpay.open();
  });
}
