export function getSubtotal(cartItems) {
  return cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
}

export function getItemCount(cartItems) {
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

export function toLineItems(items) {
  return items.map((item) =>
    typeof item.product === 'object'
      ? {
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }
      : { id: item.product, name: item.name, price: item.price, quantity: item.quantity }
  );
}
