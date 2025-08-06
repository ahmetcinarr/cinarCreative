import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cartItems, updateCartItem, removeFromCart, getCartTotal, loading } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleBuyNow = (product) => {
    if (product.tosla_url) {
      window.open(product.tosla_url, '_blank');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
        <h2>Sepetinizi Görüntülemek İçin Giriş Yapın</h2>
        <p className="text-muted mb-4">Sepetinizi görmek ve alışverişe devam etmek için giriş yapmalısınız.</p>
        <Link to="/login" className="btn btn-primary">
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border spinner-border-custom text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Sepetim - Selvi GSM</title>
          <meta name="description" content="Alışveriş sepetiniz boş. Selvi GSM'den ürün seçin ve sepetinize ekleyin." />
        </Helmet>

        <div className="container py-5 text-center">
          <i className="bi bi-cart display-1 text-muted mb-3"></i>
          <h2>Sepetiniz Boş</h2>
          <p className="text-muted mb-4">Henüz sepetinizde ürün bulunmuyor. Alışverişe başlamak için ürünlerimizi inceleyin.</p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/products" className="btn btn-primary">
              <i className="bi bi-phone me-2"></i>
              Telefonlar
            </Link>
            <Link to="/accessories" className="btn btn-outline-primary">
              <i className="bi bi-headphones me-2"></i>
              Aksesuarlar
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sepetim ({cartItems.length} ürün) - Selvi GSM</title>
        <meta name="description" content={`Sepetinizde ${cartItems.length} ürün var. Toplam tutar: ${formatPrice(getCartTotal())}`} />
      </Helmet>

      <div className="container py-5">
        <div className="row">
          <div className="col">
            <h1 className="h2 mb-4">
              <i className="bi bi-cart3 me-2"></i>
              Sepetim ({cartItems.length} ürün)
            </h1>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Cart Items */}
            <div className="card">
              <div className="card-body p-0">
                {cartItems.map((item, index) => (
                  <div key={item.product_id} className={`p-4 ${index < cartItems.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="row align-items-center">
                      <div className="col-md-2 mb-3 mb-md-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: '80px', objectFit: 'cover' }}
                        />
                      </div>
                      
                      <div className="col-md-4 mb-3 mb-md-0">
                        <Link 
                          to={`/products/${item.slug}`}
                          className="text-decoration-none"
                        >
                          <h6 className="mb-1">{item.name}</h6>
                        </Link>
                        <div className="d-flex align-items-center">
                          {item.discount_price ? (
                            <>
                              <span className="text-success fw-bold me-2">
                                {formatPrice(item.discount_price)}
                              </span>
                              <small className="text-muted text-decoration-line-through">
                                {formatPrice(item.price)}
                              </small>
                            </>
                          ) : (
                            <span className="text-success fw-bold">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3 mb-3 mb-md-0">
                        <div className="input-group" style={{ maxWidth: '120px' }}>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            type="button"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.product_id, value);
                            }}
                            min="1"
                          />
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            type="button"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>

                      <div className="col-md-2 mb-3 mb-md-0">
                        <div className="text-success fw-bold">
                          {formatPrice((item.discount_price || item.price) * item.quantity)}
                        </div>
                      </div>

                      <div className="col-md-1">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(item.product_id)}
                          title="Sepetten Kaldır"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-3">
              <Link to="/products" className="btn btn-outline-primary">
                <i className="bi bi-arrow-left me-2"></i>
                Alışverişe Devam Et
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Sipariş Özeti</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span>Ara Toplam:</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Kargo:</span>
                  <span className="text-success">Ücretsiz</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Toplam:</strong>
                  <strong className="text-success">{formatPrice(getCartTotal())}</strong>
                </div>

                <div className="d-grid gap-2">
                  {cartItems.length === 1 && cartItems[0].tosla_url && (
                    <button
                      className="btn btn-success"
                      onClick={() => handleBuyNow(cartItems[0])}
                    >
                      <i className="bi bi-lightning me-2"></i>
                      Hemen Al
                    </button>
                  )}
                  
                  <button className="btn btn-primary" disabled>
                    <i className="bi bi-credit-card me-2"></i>
                    Ödemeye Geç (Demo)
                  </button>
                </div>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Bu demo bir uygulamadır. Gerçek ödeme işlemi yapılmaz.
                  </small>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="card mt-3">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <i className="bi bi-shield-check text-primary mb-2"></i>
                    <div className="small">Güvenli Ödeme</div>
                  </div>
                  <div className="col-4">
                    <i className="bi bi-truck text-primary mb-2"></i>
                    <div className="small">Ücretsiz Kargo</div>
                  </div>
                  <div className="col-4">
                    <i className="bi bi-arrow-clockwise text-primary mb-2"></i>
                    <div className="small">14 Gün İade</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;