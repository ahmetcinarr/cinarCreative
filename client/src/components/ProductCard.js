import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Sepete eklemek için giriş yapmalısınız');
      return;
    }

    await addToCart(product.id);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.tosla_url) {
      window.open(product.tosla_url, '_blank');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!product.discount_price) return 0;
    return Math.round(((product.price - product.discount_price) / product.price) * 100);
  };

  return (
    <div className="col">
      <Link to={`/products/${product.slug}`} className="text-decoration-none">
        <div className="card product-card h-100">
          <div className="position-relative">
            <img 
              src={product.image_url} 
              className="card-img-top product-image" 
              alt={product.name}
              loading="lazy"
            />
            {product.discount_price && (
              <span className="discount-badge">
                %{calculateDiscount()} İndirim
              </span>
            )}
          </div>
          
          <div className="card-body d-flex flex-column">
            <h6 className="card-title text-dark mb-2">{product.name}</h6>
            <p className="card-text text-muted small mb-3 flex-grow-1">
              {product.short_description}
            </p>
            
            <div className="mb-3">
              <div className="d-flex align-items-center">
                {product.discount_price ? (
                  <>
                    <span className="price text-success">
                      {formatPrice(product.discount_price)}
                    </span>
                    <span className="old-price ms-2">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="price text-success">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {product.brand && (
                <small className="text-muted">
                  <i className="bi bi-tag me-1"></i>
                  {product.brand} {product.model}
                </small>
              )}
            </div>

            <div className="d-grid gap-2">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={handleAddToCart}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Sepete Ekle
              </button>
              
              {product.tosla_url && (
                <button 
                  className="btn btn-success btn-sm"
                  onClick={handleBuyNow}
                >
                  <i className="bi bi-lightning me-2"></i>
                  Hemen Al
                </button>
              )}
            </div>
          </div>
          
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <div className="card-footer bg-warning bg-opacity-25 border-0">
              <small className="text-warning fw-bold">
                <i className="bi bi-exclamation-triangle me-1"></i>
                Son {product.stock_quantity} adet!
              </small>
            </div>
          )}
          
          {product.stock_quantity === 0 && (
            <div className="card-footer bg-danger bg-opacity-25 border-0">
              <small className="text-danger fw-bold">
                <i className="bi bi-x-circle me-1"></i>
                Stokta yok
              </small>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;