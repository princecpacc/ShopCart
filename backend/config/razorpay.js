const Razorpay = require('razorpay');

let instance = null;

function getRazorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env');
  }

  return { keyId, keySecret };
}

function getRazorpay() {
  if (!instance) {
    const { keyId, keySecret } = getRazorpayKeys();
    instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return instance;
}

module.exports = { getRazorpay, getRazorpayKeys };
