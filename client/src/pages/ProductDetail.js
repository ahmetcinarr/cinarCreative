import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${slug}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Product fetch error:', error);
      if (error.response?.status === 404) {
        toast.error('Ürün bulunamadı');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Sepete eklemek için giriş yapmalısınız');
      return;
    }

    await addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border spinner-border-custom text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
        <h2>Ürün Bulunamadı</h2>
        <p className="text-muted mb-4">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/products" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Ürünlere Dön
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - Selvi GSM</title>
        <meta name="description" content={product.short_description || product.description} />
        <meta name="keywords" content={`${product.brand}, ${product.model}, ${product.name}, gsm, telefon`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.short_description} />
        <meta property="og:image" content={product.image_url} />
      </Helmet>

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Ana Sayfa</Link>
            </li>
            <li className="breadcrumb-item">
              <Link 
                to={product.category_slug === 'telefonlar' ? '/products' : '/accessories'} 
                className="text-decoration-none"
              >
                {product.category_name}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Product Image */}
          <div className="col-lg-6 mb-4">
            <div className="position-relative">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="img-fluid rounded shadow"
                style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
              />
              {product.discount_price && (
                <span className="position-absolute top-0 end-0 m-3 badge bg-danger fs-6">
                  %{calculateDiscount()} İndirim
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-6">
            <div className="mb-3">
              {product.brand && (
                <span className="badge bg-secondary me-2">{product.brand}</span>
              )}
              {product.is_featured && (
                <span className="badge bg-warning text-dark">Öne Çıkan</span>
              )}
            </div>

            <h1 className="h3 mb-3">{product.name}</h1>
            
            {product.short_description && (
              <p className="text-muted mb-4">{product.short_description}</p>
            )}

            {/* Price */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                {product.discount_price ? (
                  <>
                    <span className="h4 text-success mb-0 me-3">
                      {formatPrice(product.discount_price)}
                    </span>
                    <span className="text-muted text-decoration-line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="h4 text-success mb-0">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {product.discount_price && (
                <small className="text-success fw-bold">
                  {formatPrice(product.price - product.discount_price)} tasarruf!
                </small>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stock_quantity > 0 ? (
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <span className="text-success">Stokta var</span>
                  {product.stock_quantity <= 5 && (
                    <span className="text-warning ms-2">
                      (Son {product.stock_quantity} adet!)
                    </span>
                  )}
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <i className="bi bi-x-circle text-danger me-2"></i>
                  <span className="text-danger">Stokta yok</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            {(product.brand || product.model || product.color || product.storage) && (
              <div className="mb-4">
                <h6>Ürün Özellikleri:</h6>
                <ul className="list-unstyled">
                  {product.brand && (
                    <li><strong>Marka:</strong> {product.brand}</li>
                  )}
                  {product.model && (
                    <li><strong>Model:</strong> {product.model}</li>
                  )}
                  {product.color && (
                    <li><strong>Renk:</strong> {product.color}</li>
                  )}
                  {product.storage && (
                    <li><strong>Depolama:</strong> {product.storage}</li>
                  )}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            {product.stock_quantity > 0 && (
              <div className="mb-4">
                <div className="row g-3">
                  <div className="col-auto">
                    <label htmlFor="quantity" className="form-label">Adet:</label>
                    <select
                      id="quantity"
                      className="form-select"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      style={{ width: '80px' }}
                    >
                      {[...Array(Math.min(product.stock_quantity, 10))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col">
                    <div className="d-grid gap-2 d-md-flex">
                      <button
                        className="btn btn-outline-primary flex-grow-1"
                        onClick={handleAddToCart}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Sepete Ekle
                      </button>
                      
                      {product.tosla_url && (
                        <button
                          className="btn btn-success flex-grow-1"
                          onClick={handleBuyNow}
                        >
                          <i className="bi bi-lightning me-2"></i>
                          Hemen Al
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="row text-center">
              <div className="col-4">
                <i className="bi bi-shield-check text-primary fs-4"></i>
                <div className="small mt-1">Orijinal Ürün</div>
              </div>
              <div className="col-4">
                <i className="bi bi-truck text-primary fs-4"></i>
                <div className="small mt-1">Ücretsiz Kargo</div>
              </div>
              <div className="col-4">
                <i className="bi bi-arrow-clockwise text-primary fs-4"></i>
                <div className="small mt-1">14 Gün İade</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="row mt-5">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Ürün Açıklaması</h5>
                </div>
                <div className="card-body">
                  <div 
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    style={{ whiteSpace: 'pre-line' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;