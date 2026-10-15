import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { getErrorMessage } from '../utils/errors';
import { formatPrice, getStockText } from '../utils/product';

function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const cartAction = useAsyncAction((err) =>
    getErrorMessage(err, 'Unable to add to cart. Please try again.')
  );

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchProduct() {
      setLoading(true);
      setError('');
      setProduct(null);

      try {
        const res = await api.get(`/products/${id}`);
        if (!ignore) setProduct(res.data.product);
      } catch (err) {
        if (ignore) return;

        const status = err.response && err.response.status;
        if (status === 400 || status === 404) {
          setError('Product not found.');
        } else {
          setError('Something went wrong while loading this product.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        {loading && <p className="loading-text">Loading product...</p>}
        {!loading && error && <p className="error">{error}</p>}

        {!loading && !error && product && (
          <div className="product-details-layout">
            <img src={product.image} alt={product.name} />
            <div className="product-details-info">
              <p className="product-category">{product.category}</p>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p className="product-price">{formatPrice(product.price)}</p>
              <p className={`product-stock${product.stock <= 0 ? ' out' : product.stock <= 3 ? ' low' : ''}`}>
                {getStockText(product.stock)}
              </p>
              <button
                className="btn-primary"
                onClick={() => cartAction.run(() => addItem(product._id))}
                disabled={cartAction.saving || product.stock <= 0}
              >
                {cartAction.saving ? 'Adding...' : 'Add to Cart'}
              </button>
              {cartAction.error && <p className="error">{cartAction.error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
