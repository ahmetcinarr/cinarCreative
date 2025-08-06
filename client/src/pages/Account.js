import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Account = () => {
  const { user } = useAuth();
  const { cartItems, getCartTotal } = useCart();
  const [activeTab, setActiveTab] = useState('profile');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Hesabım - Selvi GSM</title>
        <meta name="description" content="Kullanıcı hesap bilgileri ve sipariş geçmişi" />
      </Helmet>

      <div className="container py-5">
        <div className="row">
          <div className="col">
            <h1 className="h2 mb-4">
              <i className="bi bi-person-circle me-2"></i>
              Hesabım
            </h1>
          </div>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-3">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                       style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-person text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="mb-1">{user?.firstName} {user?.lastName}</h5>
                  <p className="text-muted mb-0">{user?.email}</p>
                  {user?.is_admin && (
                    <span className="badge bg-warning text-dark mt-2">
                      <i className="bi bi-star me-1"></i>
                      Admin
                    </span>
                  )}
                </div>

                <div className="list-group list-group-flush">
                  <button
                    className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person me-2"></i>
                    Profil Bilgileri
                  </button>
                  <button
                    className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <i className="bi bi-bag me-2"></i>
                    Sipariş Geçmişi
                  </button>
                  <button
                    className={`list-group-item list-group-item-action ${activeTab === 'cart' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cart')}
                  >
                    <i className="bi bi-cart me-2"></i>
                    Sepetim
                    {cartItems.length > 0 && (
                      <span className="badge bg-primary ms-2">{cartItems.length}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-person me-2"></i>
                    Profil Bilgileri
                  </h5>
                </div>
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">Ad</label>
                        <input
                          type="text"
                          className="form-control"
                          id="firstName"
                          value={user?.firstName || ''}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Soyad</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lastName"
                          value={user?.lastName || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">E-posta</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={user?.email || ''}
                        readOnly
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="memberSince" className="form-label">Üyelik Tarihi</label>
                        <input
                          type="text"
                          className="form-control"
                          id="memberSince"
                          value={user?.created_at ? formatDate(user.created_at) : ''}
                          readOnly
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="status" className="form-label">Durum</label>
                        <input
                          type="text"
                          className="form-control"
                          id="status"
                          value={user?.is_active ? 'Aktif' : 'Pasif'}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Profil bilgilerinizi güncellemek için lütfen bizimle iletişime geçin.
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-bag me-2"></i>
                    Sipariş Geçmişi
                  </h5>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="bi bi-bag display-1 text-muted mb-3"></i>
                    <h4>Henüz Siparişiniz Yok</h4>
                    <p className="text-muted mb-4">
                      Alışverişe başlamak için ürünlerimizi inceleyin ve sepetinize ekleyin.
                    </p>
                    <a href="/products" className="btn btn-primary">
                      <i className="bi bi-phone me-2"></i>
                      Ürünleri İncele
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-cart me-2"></i>
                    Sepetim ({cartItems.length} ürün)
                  </h5>
                </div>
                <div className="card-body">
                  {cartItems.length > 0 ? (
                    <>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Ürün</th>
                              <th>Fiyat</th>
                              <th>Adet</th>
                              <th>Toplam</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map(item => (
                              <tr key={item.product_id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={item.image_url}
                                      alt={item.name}
                                      className="me-3 rounded"
                                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                    <div>
                                      <h6 className="mb-0">{item.name}</h6>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {item.discount_price ? (
                                    <>
                                      <span className="text-success fw-bold">
                                        {formatPrice(item.discount_price)}
                                      </span>
                                      <br />
                                      <small className="text-muted text-decoration-line-through">
                                        {formatPrice(item.price)}
                                      </small>
                                    </>
                                  ) : (
                                    <span className="text-success fw-bold">
                                      {formatPrice(item.price)}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <span className="badge bg-secondary">{item.quantity}</span>
                                </td>
                                <td>
                                  <span className="fw-bold text-success">
                                    {formatPrice((item.discount_price || item.price) * item.quantity)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th colSpan="3">Genel Toplam:</th>
                              <th className="text-success">
                                {formatPrice(getCartTotal())}
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      <div className="text-center mt-4">
                        <a href="/cart" className="btn btn-primary">
                          <i className="bi bi-cart me-2"></i>
                          Sepete Git
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-cart display-1 text-muted mb-3"></i>
                      <h4>Sepetiniz Boş</h4>
                      <p className="text-muted mb-4">
                        Henüz sepetinizde ürün bulunmuyor. Alışverişe başlamak için ürünlerimizi inceleyin.
                      </p>
                      <a href="/products" className="btn btn-primary">
                        <i className="bi bi-phone me-2"></i>
                        Ürünleri İncele
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;