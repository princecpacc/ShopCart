import React from 'react';
import { Link } from 'react-router-dom';
import { toggleWishlist } from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { getErrorMessage } from '../utils/errors';
import { formatPrice, getStockText } from '../utils/product';

function ProductCard({ product, isWishlisted, onWishlistChange }) {
  const { addItem } = useCart();

  const wishlistAction = useAsyncAction((err) =>
    getErrorMessage(err, 'Unable to update wishlist. Please try again.')
  );
  const cartAction = useAsyncAction((err) =>
    getErrorMessage(err, 'Unable to add to cart. Please try again.')
  );

  function handleToggleWishlist() {
    wishlistAction.run(async () => {
      const saved = await toggleWishlist(product._id);
      onWishlistChange(product._id, saved);
    });
  }

  function handleAddToCart() {
    cartAction.run(() => addItem(product._id));
  }

  function getWishlistLabel() {
    if (wishlistAction.saving) return 'Saving...';
    if (isWishlisted) return 'Saved';
    return 'Wishlist';
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-card-body">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className={`product-stock${product.stock <= 0 ? ' out' : product.stock <= 3 ? ' low' : ''}`}>
          {getStockText(product.stock)}
        </p>

        <div className="card-actions">
          <Link className="button-link" to={`/products/${product._id}`}>
            View Details
          </Link>
          <button
            className="btn-primary"
            onClick={handleAddToCart}
            disabled={cartAction.saving || outOfStock}
          >
            {cartAction.saving ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            className={`btn-secondary${isWishlisted ? ' wishlisted' : ''}`}
            onClick={handleToggleWishlist}
            disabled={wishlistAction.saving}
          >
            {getWishlistLabel()}
          </button>
        </div>

        {wishlistAction.error && <p className="error">{wishlistAction.error}</p>}
        {cartAction.error && <p className="error">{cartAction.error}</p>}
      </div>
    </div>
  );
}

export default ProductCard;
