import api from './api';

const WISHLIST_CHANGED_EVENT = 'wishlist:changed';

function notifyWishlistChanged() {
  window.dispatchEvent(new Event(WISHLIST_CHANGED_EVENT));
}

export function onWishlistChanged(handler) {
  window.addEventListener(WISHLIST_CHANGED_EVENT, handler);
  return () => window.removeEventListener(WISHLIST_CHANGED_EVENT, handler);
}

export async function getWishlist() {
  const res = await api.get('/wishlist');
  return res.data.wishlist;
}

export async function getWishlistCount() {
  const res = await api.get('/wishlist/count');
  return res.data.count;
}

export async function toggleWishlist(productId) {
  try {
    const res = await api.patch(`/wishlist/${productId}/toggle`);
    return res.data.saved;
  } finally {
    notifyWishlistChanged();
  }
}

export async function removeFromWishlist(productId) {
  try {
    await api.delete(`/wishlist/${productId}`);
  } finally {
    notifyWishlistChanged();
  }
}
